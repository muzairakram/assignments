import Foundation
import UserNotifications
import AVFoundation
import Combine

// MARK: - Alarm Sound

enum AlarmSound: String, CaseIterable, Identifiable, Codable {
    case gentleRise = "Gentle Rise"
    case softAdhaan = "Soft Adhaan"
    case dawnBirds = "Dawn Birds"
    case crystalChime = "Crystal Chime"

    var id: String { rawValue }

    /// System sound name used for notification
    var systemSoundName: String {
        switch self {
        case .gentleRise:   return "gentle_rise"
        case .softAdhaan:   return "soft_adhaan"
        case .dawnBirds:    return "dawn_birds"
        case .crystalChime: return "crystal_chime"
        }
    }

    /// SF Symbol icon
    var icon: String {
        switch self {
        case .gentleRise:   return "sunrise"
        case .softAdhaan:   return "speaker.wave.2"
        case .dawnBirds:    return "bird"
        case .crystalChime: return "bell"
        }
    }
}

// MARK: - Buffer Time

enum BufferTime: Int, CaseIterable, Identifiable, Codable {
    case fifteen = 15
    case thirty = 30
    case fortyFive = 45
    case sixty = 60

    var id: Int { rawValue }

    var label: String { "\(rawValue)" }
}

// MARK: - Alarm Manager

final class AlarmManager: ObservableObject {

    static let shared = AlarmManager()

    // MARK: Published State

    @Published var isAlarmEnabled: Bool {
        didSet { UserDefaults.standard.set(isAlarmEnabled, forKey: "isAlarmEnabled") }
    }

    @Published var selectedBuffer: BufferTime {
        didSet {
            if let data = try? JSONEncoder().encode(selectedBuffer) {
                UserDefaults.standard.set(data, forKey: "selectedBuffer")
            }
        }
    }

    @Published var selectedSound: AlarmSound {
        didSet {
            if let data = try? JSONEncoder().encode(selectedSound) {
                UserDefaults.standard.set(data, forKey: "selectedSound")
            }
        }
    }

    @Published var escalatingVolume: Bool {
        didSet { UserDefaults.standard.set(escalatingVolume, forKey: "escalatingVolume") }
    }

    @Published var calculationMethod: CalculationMethod {
        didSet {
            if let data = try? JSONEncoder().encode(calculationMethod) {
                UserDefaults.standard.set(data, forKey: "calculationMethod")
            }
        }
    }

    @Published var nextFajrTime: Date?
    @Published var scheduledAlarmTime: Date?

    // MARK: Audio

    private var audioPlayer: AVAudioPlayer?
    private var volumeTimer: Timer?

    // MARK: Init

    private init() {
        isAlarmEnabled = UserDefaults.standard.bool(forKey: "isAlarmEnabled")
        escalatingVolume = UserDefaults.standard.bool(forKey: "escalatingVolume")

        if let data = UserDefaults.standard.data(forKey: "selectedBuffer"),
           let buffer = try? JSONDecoder().decode(BufferTime.self, from: data) {
            selectedBuffer = buffer
        } else {
            selectedBuffer = .thirty
        }

        if let data = UserDefaults.standard.data(forKey: "selectedSound"),
           let sound = try? JSONDecoder().decode(AlarmSound.self, from: data) {
            selectedSound = sound
        } else {
            selectedSound = .gentleRise
        }

        if let data = UserDefaults.standard.data(forKey: "calculationMethod"),
           let method = try? JSONDecoder().decode(CalculationMethod.self, from: data) {
            calculationMethod = method
        } else {
            calculationMethod = .muslimWorldLeague
        }

        configureAudioSession()
    }

    // MARK: - Public

    func refreshFajrTime() {
        guard let coordinate = LocationService.shared.coordinate else { return }
        nextFajrTime = PrayerTimeService.shared.nextFajrTime(
            coordinate: coordinate,
            method: calculationMethod
        )
        if isAlarmEnabled {
            scheduleAlarm()
        }
    }

    func toggleAlarm() {
        isAlarmEnabled.toggle()
        if isAlarmEnabled {
            requestNotificationPermission()
            scheduleAlarm()
        } else {
            cancelAlarm()
        }
    }

    func scheduleAlarm() {
        guard isAlarmEnabled, let fajr = nextFajrTime else { return }

        let alarmDate = fajr.addingTimeInterval(-Double(selectedBuffer.rawValue) * 60.0)
        scheduledAlarmTime = alarmDate

        let center = UNUserNotificationCenter.current()
        center.removePendingNotificationRequests(withIdentifiers: ["suhoor_alarm", "suhoor_alarm_snooze"])

        let content = UNMutableNotificationContent()
        content.title = "Suhoor Time"
        content.body = "Wake up! Fajr is in \(selectedBuffer.rawValue) minutes. Time for Suhoor."
        content.sound = UNNotificationSound.defaultCritical
        content.interruptionLevel = .timeSensitive
        content.categoryIdentifier = "SUHOOR_ALARM"

        let components = Calendar.current.dateComponents(
            [.year, .month, .day, .hour, .minute, .second],
            from: alarmDate
        )
        let trigger = UNCalendarNotificationTrigger(dateMatching: components, repeats: false)

        let request = UNNotificationRequest(identifier: "suhoor_alarm", content: content, trigger: trigger)
        center.add(request)
    }

    func scheduleSnooze() {
        let content = UNMutableNotificationContent()
        content.title = "Suhoor Time"
        content.body = "Snooze ended. Wake up for Suhoor!"
        content.sound = UNNotificationSound.defaultCritical
        content.interruptionLevel = .timeSensitive
        content.categoryIdentifier = "SUHOOR_ALARM"

        let trigger = UNTimeIntervalNotificationTrigger(timeInterval: 300, repeats: false)
        let request = UNNotificationRequest(identifier: "suhoor_alarm_snooze", content: content, trigger: trigger)
        UNUserNotificationCenter.current().add(request)
    }

    func cancelAlarm() {
        scheduledAlarmTime = nil
        UNUserNotificationCenter.current().removePendingNotificationRequests(
            withIdentifiers: ["suhoor_alarm", "suhoor_alarm_snooze"]
        )
    }

    // MARK: - Audio

    func playAlarmSound() {
        // Use system sounds as fallback since we have no bundled audio files
        configureAudioSession()

        // Escalating volume
        if escalatingVolume {
            audioPlayer?.volume = 0.05
            var elapsed: Float = 0
            volumeTimer = Timer.scheduledTimer(withTimeInterval: 1.0, repeats: true) { [weak self] timer in
                elapsed += 1
                let progress = min(elapsed / 30.0, 1.0)
                self?.audioPlayer?.volume = progress
                if progress >= 1.0 { timer.invalidate() }
            }
        }
    }

    func stopAlarmSound() {
        volumeTimer?.invalidate()
        volumeTimer = nil
        audioPlayer?.stop()
        audioPlayer = nil
    }

    // MARK: - Notifications

    func requestNotificationPermission() {
        let center = UNUserNotificationCenter.current()
        center.requestAuthorization(options: [.alert, .sound, .badge, .criticalAlert]) { _, _ in }
    }

    func registerNotificationCategories() {
        let snooze = UNNotificationAction(
            identifier: "SNOOZE_ACTION",
            title: "Snooze (5 min)",
            options: []
        )
        let dismiss = UNNotificationAction(
            identifier: "DISMISS_ACTION",
            title: "Dismiss",
            options: [.destructive]
        )
        let category = UNNotificationCategory(
            identifier: "SUHOOR_ALARM",
            actions: [snooze, dismiss],
            intentIdentifiers: [],
            options: [.customDismissAction]
        )
        UNUserNotificationCenter.current().setNotificationCategories([category])
    }

    // MARK: - Countdown

    var countdownToSuhoor: (hours: Int, minutes: Int, seconds: Int)? {
        guard let fajr = nextFajrTime else { return nil }
        let alarmTime = fajr.addingTimeInterval(-Double(selectedBuffer.rawValue) * 60.0)
        let interval = alarmTime.timeIntervalSince(Date())
        guard interval > 0 else { return nil }

        let h = Int(interval) / 3600
        let m = (Int(interval) % 3600) / 60
        let s = Int(interval) % 60
        return (h, m, s)
    }

    // MARK: - Private

    private func configureAudioSession() {
        do {
            try AVAudioSession.sharedInstance().setCategory(.playback, mode: .default, options: [.mixWithOthers])
            try AVAudioSession.sharedInstance().setActive(true)
        } catch { }
    }
}
