import SwiftUI
import UserNotifications

@main
struct SuhoorAlarmApp: App {

    init() {
        // Set up notification delegate
        UNUserNotificationCenter.current().delegate = NotificationDelegate.shared

        // Register notification categories (Snooze / Dismiss)
        AlarmManager.shared.registerNotificationCategories()
    }

    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}
