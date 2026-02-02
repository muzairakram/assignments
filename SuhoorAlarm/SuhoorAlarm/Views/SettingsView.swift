import SwiftUI

struct SettingsView: View {

    @StateObject private var alarmManager = AlarmManager.shared
    @StateObject private var locationService = LocationService.shared
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        NavigationStack {
            ZStack {
                // Background
                LinearGradient(
                    colors: [
                        Color(hex: "0a0a1a"),
                        Color(hex: "1a1a2e"),
                        Color(hex: "16213e")
                    ],
                    startPoint: .top,
                    endPoint: .bottom
                )
                .ignoresSafeArea()

                ScrollView(showsIndicators: false) {
                    VStack(spacing: 20) {
                        // Location Card
                        locationCard

                        // Sound Picker
                        soundCard

                        // Calculation Method
                        methodCard

                        // Tips
                        tipsCard

                        // About
                        aboutCard

                        Spacer().frame(height: 40)
                    }
                    .padding(.horizontal, 20)
                    .padding(.top, 8)
                }
            }
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .principal) {
                    Text("Settings")
                        .font(.system(.title3, design: .rounded, weight: .semibold))
                        .foregroundStyle(Color.gold)
                }
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button {
                        dismiss()
                    } label: {
                        Image(systemName: "xmark.circle.fill")
                            .foregroundStyle(.white.opacity(0.4))
                    }
                }
            }
        }
        .preferredColorScheme(.dark)
    }

    // MARK: - Location Card

    private var locationCard: some View {
        GlassCard {
            VStack(alignment: .leading, spacing: 14) {
                Label("Location", systemImage: "location.fill")
                    .font(.system(.subheadline, design: .rounded, weight: .semibold))
                    .foregroundStyle(Color.gold)

                VStack(alignment: .leading, spacing: 8) {
                    HStack {
                        Text(locationService.cityName)
                            .font(.system(.title3, design: .rounded, weight: .medium))
                            .foregroundStyle(.white)
                        Text(locationService.countryName)
                            .font(.system(.subheadline, design: .rounded))
                            .foregroundStyle(.white.opacity(0.5))
                    }

                    Text(locationService.coordinateString)
                        .font(.system(.caption, design: .monospaced))
                        .foregroundStyle(.white.opacity(0.3))
                }

                Button {
                    locationService.requestLocation()
                    UIImpactFeedbackGenerator(style: .light).impactOccurred()
                } label: {
                    HStack(spacing: 6) {
                        if locationService.isLocating {
                            ProgressView()
                                .tint(Color(hex: "0a0a1a"))
                                .scaleEffect(0.7)
                        } else {
                            Image(systemName: "arrow.clockwise")
                                .font(.caption)
                        }
                        Text("Refresh Location")
                            .font(.system(.caption, design: .rounded, weight: .medium))
                    }
                    .foregroundStyle(Color(hex: "0a0a1a"))
                    .padding(.horizontal, 16)
                    .padding(.vertical, 8)
                    .background(Capsule().fill(Color.gold))
                }
                .disabled(locationService.isLocating)
            }
        }
    }

    // MARK: - Sound Card

    private var soundCard: some View {
        GlassCard {
            VStack(alignment: .leading, spacing: 14) {
                Label("Alarm Sound", systemImage: "speaker.wave.2.fill")
                    .font(.system(.subheadline, design: .rounded, weight: .semibold))
                    .foregroundStyle(Color.gold)

                ForEach(AlarmSound.allCases) { sound in
                    Button {
                        alarmManager.selectedSound = sound
                        UIImpactFeedbackGenerator(style: .light).impactOccurred()
                    } label: {
                        HStack {
                            Image(systemName: sound.icon)
                                .frame(width: 24)
                                .foregroundStyle(
                                    alarmManager.selectedSound == sound
                                    ? Color.gold
                                    : .white.opacity(0.4)
                                )

                            Text(sound.rawValue)
                                .font(.system(.body, design: .rounded))
                                .foregroundStyle(
                                    alarmManager.selectedSound == sound
                                    ? .white
                                    : .white.opacity(0.5)
                                )

                            Spacer()

                            if alarmManager.selectedSound == sound {
                                Image(systemName: "checkmark.circle.fill")
                                    .foregroundStyle(Color.gold)
                            }
                        }
                        .padding(.vertical, 6)
                    }
                }

                Divider().opacity(0.2)

                Toggle(isOn: $alarmManager.escalatingVolume) {
                    VStack(alignment: .leading, spacing: 2) {
                        Text("Escalating Volume")
                            .font(.system(.body, design: .rounded))
                            .foregroundStyle(.white)
                        Text("Gradually increases over 30 seconds")
                            .font(.system(.caption, design: .rounded))
                            .foregroundStyle(.white.opacity(0.4))
                    }
                }
                .tint(Color.gold)
            }
        }
    }

    // MARK: - Method Card

    private var methodCard: some View {
        GlassCard {
            VStack(alignment: .leading, spacing: 14) {
                Label("Calculation Method", systemImage: "function")
                    .font(.system(.subheadline, design: .rounded, weight: .semibold))
                    .foregroundStyle(Color.gold)

                Menu {
                    ForEach(CalculationMethod.allCases) { method in
                        Button {
                            alarmManager.calculationMethod = method
                        } label: {
                            HStack {
                                Text(method.rawValue)
                                if alarmManager.calculationMethod == method {
                                    Image(systemName: "checkmark")
                                }
                            }
                        }
                    }
                } label: {
                    HStack {
                        Text(alarmManager.calculationMethod.rawValue)
                            .font(.system(.body, design: .rounded))
                            .foregroundStyle(.white)
                        Spacer()
                        Image(systemName: "chevron.up.chevron.down")
                            .font(.caption)
                            .foregroundStyle(.white.opacity(0.4))
                    }
                    .padding(12)
                    .background {
                        RoundedRectangle(cornerRadius: 10, style: .continuous)
                            .fill(.white.opacity(0.05))
                    }
                }

                Text("Fajr angle: \(String(format: "%.1f", alarmManager.calculationMethod.fajrAngle)) degrees")
                    .font(.system(.caption, design: .rounded))
                    .foregroundStyle(.white.opacity(0.3))
            }
        }
    }

    // MARK: - Tips Card

    private var tipsCard: some View {
        GlassCard {
            VStack(alignment: .leading, spacing: 14) {
                Label("Tips", systemImage: "lightbulb.fill")
                    .font(.system(.subheadline, design: .rounded, weight: .semibold))
                    .foregroundStyle(Color.gold)

                tipRow(icon: "bell.badge", text: "Enable notifications in Settings for alarms to work")
                tipRow(icon: "moon.fill", text: "Add Suhoor Alarm to Focus mode allowed apps")
                tipRow(icon: "speaker.wave.3", text: "Keep the silent switch off for alarm sounds")
                tipRow(icon: "battery.100", text: "Disable Low Power Mode for reliable background alerts")
            }
        }
    }

    private func tipRow(icon: String, text: String) -> some View {
        HStack(alignment: .top, spacing: 10) {
            Image(systemName: icon)
                .font(.caption)
                .foregroundStyle(Color.gold.opacity(0.6))
                .frame(width: 20)
            Text(text)
                .font(.system(.caption, design: .rounded))
                .foregroundStyle(.white.opacity(0.5))
        }
    }

    // MARK: - About Card

    private var aboutCard: some View {
        GlassCard {
            VStack(alignment: .leading, spacing: 10) {
                Label("About", systemImage: "info.circle")
                    .font(.system(.subheadline, design: .rounded, weight: .semibold))
                    .foregroundStyle(Color.gold)

                HStack {
                    Text("Suhoor Alarm")
                        .font(.system(.body, design: .rounded))
                        .foregroundStyle(.white)
                    Spacer()
                    Text("v1.0.0")
                        .font(.system(.caption, design: .rounded))
                        .foregroundStyle(.white.opacity(0.3))
                }

                Text("Accurate Fajr prayer time calculation using astronomical formulas. No internet required after initial location fix.")
                    .font(.system(.caption, design: .rounded))
                    .foregroundStyle(.white.opacity(0.4))
            }
        }
    }
}

// MARK: - Glass Card

struct GlassCard<Content: View>: View {
    let content: () -> Content

    init(@ViewBuilder content: @escaping () -> Content) {
        self.content = content
    }

    var body: some View {
        VStack(alignment: .leading) {
            content()
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(20)
        .background {
            RoundedRectangle(cornerRadius: 20, style: .continuous)
                .fill(.ultraThinMaterial)
                .opacity(0.6)
        }
        .overlay {
            RoundedRectangle(cornerRadius: 20, style: .continuous)
                .strokeBorder(Color.gold.opacity(0.1), lineWidth: 0.5)
        }
    }
}

#Preview {
    SettingsView()
}
