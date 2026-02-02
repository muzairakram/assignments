import WidgetKit
import SwiftUI

// MARK: - Timeline Entry

struct SuhoorEntry: TimelineEntry {
    let date: Date
    let fajrTime: Date?
    let countdownText: String
    let fajrTimeText: String
    let isAlarmEnabled: Bool
}

// MARK: - Timeline Provider

struct SuhoorTimelineProvider: TimelineProvider {

    func placeholder(in context: Context) -> SuhoorEntry {
        SuhoorEntry(
            date: Date(),
            fajrTime: nil,
            countdownText: "03:42",
            fajrTimeText: "5:12 AM",
            isAlarmEnabled: true
        )
    }

    func getSnapshot(in context: Context, completion: @escaping (SuhoorEntry) -> Void) {
        completion(makeEntry())
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<SuhoorEntry>) -> Void) {
        let entry = makeEntry()
        // Refresh every 15 minutes
        let nextUpdate = Calendar.current.date(byAdding: .minute, value: 15, to: Date()) ?? Date()
        let timeline = Timeline(entries: [entry], policy: .after(nextUpdate))
        completion(timeline)
    }

    private func makeEntry() -> SuhoorEntry {
        let defaults = UserDefaults.standard
        let lat = defaults.double(forKey: "savedLatitude")
        let lon = defaults.double(forKey: "savedLongitude")
        let isEnabled = defaults.bool(forKey: "isAlarmEnabled")

        var fajr: Date?
        var countdownText = "--:--"
        var fajrTimeText = "--:--"

        if lat != 0 || lon != 0 {
            let coord = CLLocationCoordinate2D(latitude: lat, longitude: lon)

            // Decode method
            var method: CalculationMethod = .muslimWorldLeague
            if let data = defaults.data(forKey: "calculationMethod"),
               let decoded = try? JSONDecoder().decode(CalculationMethod.self, from: data) {
                method = decoded
            }

            fajr = PrayerTimeService.shared.nextFajrTime(coordinate: coord, method: method)

            if let fajr {
                fajrTimeText = fajr.formatted(date: .omitted, time: .shortened)

                // Decode buffer
                var bufferMinutes = 30
                if let bufData = defaults.data(forKey: "selectedBuffer"),
                   let buf = try? JSONDecoder().decode(BufferTime.self, from: bufData) {
                    bufferMinutes = buf.rawValue
                }

                let alarmTime = fajr.addingTimeInterval(-Double(bufferMinutes) * 60)
                let interval = alarmTime.timeIntervalSince(Date())
                if interval > 0 {
                    let h = Int(interval) / 3600
                    let m = (Int(interval) % 3600) / 60
                    countdownText = String(format: "%d:%02d", h, m)
                } else {
                    countdownText = "0:00"
                }
            }
        }

        return SuhoorEntry(
            date: Date(),
            fajrTime: fajr,
            countdownText: countdownText,
            fajrTimeText: fajrTimeText,
            isAlarmEnabled: isEnabled
        )
    }
}

// We need CLLocationCoordinate2D
import CoreLocation

// MARK: - Small Widget View

struct SmallWidgetView: View {
    let entry: SuhoorEntry

    var body: some View {
        ZStack {
            // Background
            LinearGradient(
                colors: [Color(hex: "0a0a1a"), Color(hex: "1a1a2e")],
                startPoint: .top,
                endPoint: .bottom
            )

            VStack(spacing: 8) {
                // Moon icon
                ZStack {
                    Circle()
                        .fill(Color.gold)
                        .frame(width: 28, height: 28)
                    Circle()
                        .fill(Color(hex: "0a0a1a"))
                        .frame(width: 22, height: 22)
                        .offset(x: 6, y: -4)
                }

                Text(entry.countdownText)
                    .font(.system(size: 28, weight: .light, design: .rounded))
                    .foregroundStyle(.white)
                    .monospacedDigit()

                Text("until Suhoor")
                    .font(.system(size: 10, weight: .medium, design: .rounded))
                    .foregroundStyle(.white.opacity(0.5))
            }
        }
        .containerBackground(for: .widget) {
            LinearGradient(
                colors: [Color(hex: "0a0a1a"), Color(hex: "1a1a2e")],
                startPoint: .top,
                endPoint: .bottom
            )
        }
    }
}

// MARK: - Medium Widget View

struct MediumWidgetView: View {
    let entry: SuhoorEntry

    var body: some View {
        ZStack {
            LinearGradient(
                colors: [Color(hex: "0a0a1a"), Color(hex: "1a1a2e"), Color(hex: "16213e")],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )

            HStack(spacing: 20) {
                // Left: countdown
                VStack(spacing: 6) {
                    ZStack {
                        Circle()
                            .fill(Color.gold)
                            .frame(width: 24, height: 24)
                        Circle()
                            .fill(Color(hex: "0a0a1a"))
                            .frame(width: 18, height: 18)
                            .offset(x: 5, y: -3)
                    }

                    Text(entry.countdownText)
                        .font(.system(size: 32, weight: .light, design: .rounded))
                        .foregroundStyle(.white)
                        .monospacedDigit()

                    Text("until Suhoor")
                        .font(.system(size: 10, weight: .medium, design: .rounded))
                        .foregroundStyle(.white.opacity(0.5))
                }

                // Divider
                Rectangle()
                    .fill(Color.gold.opacity(0.2))
                    .frame(width: 1, height: 60)

                // Right: Fajr time + alarm status
                VStack(alignment: .leading, spacing: 8) {
                    HStack(spacing: 4) {
                        Image(systemName: "sun.horizon")
                            .font(.system(size: 11))
                            .foregroundStyle(Color.gold.opacity(0.7))
                        Text("Fajr")
                            .font(.system(size: 11, weight: .medium, design: .rounded))
                            .foregroundStyle(.white.opacity(0.5))
                    }

                    Text(entry.fajrTimeText)
                        .font(.system(size: 22, weight: .light, design: .rounded))
                        .foregroundStyle(.white)

                    HStack(spacing: 4) {
                        Image(systemName: entry.isAlarmEnabled ? "bell.fill" : "bell.slash")
                            .font(.system(size: 10))
                            .foregroundStyle(entry.isAlarmEnabled ? Color.gold : .white.opacity(0.3))
                        Text(entry.isAlarmEnabled ? "Alarm on" : "Alarm off")
                            .font(.system(size: 10, weight: .medium, design: .rounded))
                            .foregroundStyle(entry.isAlarmEnabled ? Color.gold.opacity(0.8) : .white.opacity(0.3))
                    }
                }
            }
        }
        .containerBackground(for: .widget) {
            LinearGradient(
                colors: [Color(hex: "0a0a1a"), Color(hex: "1a1a2e"), Color(hex: "16213e")],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
        }
    }
}

// MARK: - Lock Screen Circular Widget

struct CircularLockScreenView: View {
    let entry: SuhoorEntry

    var body: some View {
        ZStack {
            AccessoryWidgetBackground()

            VStack(spacing: 1) {
                ZStack {
                    Circle()
                        .fill(.white)
                        .frame(width: 12, height: 12)
                    Circle()
                        .fill(.black)
                        .frame(width: 9, height: 9)
                        .offset(x: 3, y: -2)
                }

                Text(entry.countdownText)
                    .font(.system(size: 12, weight: .medium, design: .rounded))
                    .monospacedDigit()
                    .minimumScaleFactor(0.6)
            }
        }
        .containerBackground(for: .widget) {
            AccessoryWidgetBackground()
        }
    }
}

// MARK: - Lock Screen Rectangular Widget

struct RectangularLockScreenView: View {
    let entry: SuhoorEntry

    var body: some View {
        HStack(spacing: 6) {
            ZStack {
                Circle()
                    .fill(.white)
                    .frame(width: 14, height: 14)
                Circle()
                    .fill(.black)
                    .frame(width: 10, height: 10)
                    .offset(x: 3, y: -2)
            }

            VStack(alignment: .leading, spacing: 1) {
                Text("Suhoor in \(entry.countdownText)")
                    .font(.system(size: 13, weight: .medium, design: .rounded))
                Text("Fajr \(entry.fajrTimeText)")
                    .font(.system(size: 11, design: .rounded))
                    .opacity(0.6)
            }
        }
        .containerBackground(for: .widget) {
            AccessoryWidgetBackground()
        }
    }
}

// MARK: - Widget Configuration

struct SuhoorWidget: Widget {
    let kind = "SuhoorWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: SuhoorTimelineProvider()) { entry in
            SmallWidgetView(entry: entry)
        }
        .configurationDisplayName("Suhoor Countdown")
        .description("Countdown to Suhoor with moon icon")
        .supportedFamilies([.systemSmall])
    }
}

struct SuhoorMediumWidget: Widget {
    let kind = "SuhoorMediumWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: SuhoorTimelineProvider()) { entry in
            MediumWidgetView(entry: entry)
        }
        .configurationDisplayName("Suhoor Details")
        .description("Countdown, Fajr time, and alarm status")
        .supportedFamilies([.systemMedium])
    }
}

struct SuhoorCircularWidget: Widget {
    let kind = "SuhoorCircularWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: SuhoorTimelineProvider()) { entry in
            CircularLockScreenView(entry: entry)
        }
        .configurationDisplayName("Suhoor")
        .description("Lock screen countdown")
        .supportedFamilies([.accessoryCircular])
    }
}

struct SuhoorRectangularWidget: Widget {
    let kind = "SuhoorRectangularWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: SuhoorTimelineProvider()) { entry in
            RectangularLockScreenView(entry: entry)
        }
        .configurationDisplayName("Suhoor Info")
        .description("Lock screen Suhoor and Fajr times")
        .supportedFamilies([.accessoryRectangular])
    }
}

// MARK: - Widget Bundle

@main
struct SuhoorWidgetBundle: WidgetBundle {
    var body: some Widget {
        SuhoorWidget()
        SuhoorMediumWidget()
        SuhoorCircularWidget()
        SuhoorRectangularWidget()
    }
}

// MARK: - Color Extension (Widget)

extension Color {
    static let gold = Color(hex: "ffd700")

    init(hex: String) {
        let hex = hex.trimmingCharacters(in: .alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: hex).scanHexInt64(&int)
        let r, g, b: Double
        switch hex.count {
        case 6:
            r = Double((int >> 16) & 0xFF) / 255.0
            g = Double((int >> 8) & 0xFF) / 255.0
            b = Double(int & 0xFF) / 255.0
        default:
            r = 1; g = 1; b = 1
        }
        self.init(red: r, green: g, blue: b)
    }
}
