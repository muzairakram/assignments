import Foundation
import UserNotifications

final class NotificationDelegate: NSObject, UNUserNotificationCenterDelegate {

    static let shared = NotificationDelegate()

    private override init() {
        super.init()
    }

    // Show notification banner even when app is in foreground
    func userNotificationCenter(
        _ center: UNUserNotificationCenter,
        willPresent notification: UNNotification,
        withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void
    ) {
        AlarmManager.shared.playAlarmSound()
        completionHandler([.banner, .sound, .badge])
    }

    // Handle notification actions (Snooze / Dismiss)
    func userNotificationCenter(
        _ center: UNUserNotificationCenter,
        didReceive response: UNNotificationResponse,
        withCompletionHandler completionHandler: @escaping () -> Void
    ) {
        AlarmManager.shared.stopAlarmSound()

        switch response.actionIdentifier {
        case "SNOOZE_ACTION":
            AlarmManager.shared.scheduleSnooze()

        case "DISMISS_ACTION", UNNotificationDismissActionIdentifier:
            AlarmManager.shared.cancelAlarm()

        default:
            // Tapped the notification itself
            break
        }

        completionHandler()
    }
}
