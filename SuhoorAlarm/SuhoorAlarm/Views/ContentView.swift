import SwiftUI

// MARK: - Main Content View

struct ContentView: View {

    @StateObject private var alarmManager = AlarmManager.shared
    @StateObject private var locationService = LocationService.shared

    @State private var showSettings = false
    @State private var currentTime = Date()
    @State private var moonRotation: Double = 0
    @State private var starOpacities: [Double] = (0..<30).map { _ in Double.random(in: 0.2...0.8) }

    private let timer = Timer.publish(every: 1, on: .main, in: .common).autoconnect()

    var body: some View {
        NavigationStack {
            ZStack {
                // Background gradient
                backgroundGradient

                // Star particles
                starField

                // Main content
                ScrollView(showsIndicators: false) {
                    VStack(spacing: 24) {
                        Spacer().frame(height: 8)

                        // Crescent moon
                        crescentMoon

                        // Current time
                        timeDisplay

                        // Countdown card
                        countdownCard

                        // Alarm toggle
                        alarmToggle

                        // Buffer selector
                        bufferSelector

                        Spacer().frame(height: 40)
                    }
                    .padding(.horizontal, 20)
                }
            }
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .principal) {
                    Text("Suhoor")
                        .font(.system(.title3, design: .rounded, weight: .semibold))
                        .foregroundStyle(Color.gold)
                }
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button {
                        showSettings = true
                    } label: {
                        Image(systemName: "gearshape.fill")
                            .foregroundStyle(Color.gold.opacity(0.8))
                    }
                }
            }
            .sheet(isPresented: $showSettings) {
                SettingsView()
            }
        }
        .preferredColorScheme(.dark)
        .onReceive(timer) { time in
            currentTime = time
            withAnimation(.easeInOut(duration: 2)) {
                starOpacities = starOpacities.map { _ in Double.random(in: 0.2...0.9) }
            }
        }
        .onAppear {
            locationService.requestPermission()
            alarmManager.registerNotificationCategories()
            alarmManager.requestNotificationPermission()
            DispatchQueue.main.asyncAfter(deadline: .now() + 1.5) {
                alarmManager.refreshFajrTime()
            }
            withAnimation(.linear(duration: 60).repeatForever(autoreverses: false)) {
                moonRotation = 360
            }
        }
        .onChange(of: locationService.coordinate?.latitude) { _, _ in
            alarmManager.refreshFajrTime()
        }
        .onChange(of: alarmManager.calculationMethod) { _, _ in
            alarmManager.refreshFajrTime()
        }
        .onChange(of: alarmManager.selectedBuffer) { _, _ in
            if alarmManager.isAlarmEnabled {
                alarmManager.scheduleAlarm()
            }
        }
    }

    // MARK: - Background

    private var backgroundGradient: some View {
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
    }

    // MARK: - Stars

    private var starField: some View {
        GeometryReader { geo in
            ForEach(0..<30, id: \.self) { i in
                Circle()
                    .fill(Color.white)
                    .frame(width: CGFloat.random(in: 1...3), height: CGFloat.random(in: 1...3))
                    .position(
                        x: CGFloat(((i * 137 + 53) % Int(geo.size.width == 0 ? 390 : geo.size.width))),
                        y: CGFloat(((i * 89 + 31) % Int(geo.size.height == 0 ? 844 : geo.size.height)))
                    )
                    .opacity(starOpacities[i])
            }
        }
        .ignoresSafeArea()
    }

    // MARK: - Crescent Moon

    private var crescentMoon: some View {
        ZStack {
            // Outer glow
            Circle()
                .fill(Color.gold.opacity(0.08))
                .frame(width: 160, height: 160)
                .blur(radius: 30)

            // Inner glow
            Circle()
                .fill(Color.gold.opacity(0.12))
                .frame(width: 100, height: 100)
                .blur(radius: 15)

            // Crescent shape
            ZStack {
                Circle()
                    .fill(Color.gold)
                    .frame(width: 70, height: 70)

                Circle()
                    .fill(Color(hex: "0a0a1a"))
                    .frame(width: 56, height: 56)
                    .offset(x: 14, y: -8)
            }
            .shadow(color: Color.gold.opacity(0.5), radius: 20)
            .rotationEffect(.degrees(moonRotation * 0.02))
        }
        .frame(height: 140)
    }

    // MARK: - Time Display

    private var timeDisplay: some View {
        VStack(spacing: 4) {
            Text(currentTime, style: .time)
                .font(.system(size: 72, weight: .thin, design: .rounded))
                .foregroundStyle(.white)
                .monospacedDigit()

            Text(currentTime.formatted(.dateTime.weekday(.wide).month(.wide).day()))
                .font(.system(.subheadline, design: .rounded))
                .foregroundStyle(.white.opacity(0.5))
        }
    }

    // MARK: - Countdown Card

    private var countdownCard: some View {
        VStack(spacing: 12) {
            Text("SUHOOR ENDS IN")
                .font(.system(.caption, design: .rounded, weight: .semibold))
                .foregroundStyle(Color.gold.opacity(0.8))
                .tracking(2)

            if let countdown = alarmManager.countdownToSuhoor {
                Text(String(format: "%02d:%02d:%02d", countdown.hours, countdown.minutes, countdown.seconds))
                    .font(.system(size: 48, weight: .light, design: .rounded))
                    .foregroundStyle(.white)
                    .monospacedDigit()
                    .contentTransition(.numericText())
            } else {
                Text("--:--:--")
                    .font(.system(size: 48, weight: .light, design: .rounded))
                    .foregroundStyle(.white.opacity(0.3))
            }

            if let fajr = alarmManager.nextFajrTime {
                HStack(spacing: 6) {
                    Image(systemName: "sun.horizon")
                        .font(.caption)
                    Text("Fajr at \(fajr.formatted(date: .omitted, time: .shortened))")
                        .font(.system(.caption, design: .rounded))
                }
                .foregroundStyle(.white.opacity(0.5))
            }
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 24)
        .padding(.horizontal, 20)
        .background {
            RoundedRectangle(cornerRadius: 20, style: .continuous)
                .fill(.ultraThinMaterial)
                .opacity(0.6)
        }
        .overlay {
            RoundedRectangle(cornerRadius: 20, style: .continuous)
                .strokeBorder(Color.gold.opacity(0.15), lineWidth: 0.5)
        }
    }

    // MARK: - Alarm Toggle

    private var alarmToggle: some View {
        Button {
            withAnimation(.spring(response: 0.4, dampingFraction: 0.6)) {
                alarmManager.toggleAlarm()
            }
            UIImpactFeedbackGenerator(style: .medium).impactOccurred()
        } label: {
            ZStack {
                Circle()
                    .fill(alarmManager.isAlarmEnabled ? Color.gold : Color.white.opacity(0.08))
                    .frame(width: 80, height: 80)
                    .shadow(color: alarmManager.isAlarmEnabled ? Color.gold.opacity(0.4) : .clear, radius: 16)

                Image(systemName: alarmManager.isAlarmEnabled ? "bell.fill" : "bell.slash")
                    .font(.system(size: 30, weight: .medium))
                    .foregroundStyle(alarmManager.isAlarmEnabled ? Color(hex: "0a0a1a") : .white.opacity(0.4))
            }
        }
        .sensoryFeedback(.impact(flexibility: .solid), trigger: alarmManager.isAlarmEnabled)
        .padding(.vertical, 8)
    }

    // MARK: - Buffer Selector

    private var bufferSelector: some View {
        VStack(spacing: 12) {
            Text("Minutes before Fajr")
                .font(.system(.caption, design: .rounded))
                .foregroundStyle(.white.opacity(0.4))

            HStack(spacing: 12) {
                ForEach(BufferTime.allCases) { buffer in
                    Button {
                        withAnimation(.spring(response: 0.3)) {
                            alarmManager.selectedBuffer = buffer
                        }
                        UIImpactFeedbackGenerator(style: .light).impactOccurred()
                    } label: {
                        Text(buffer.label)
                            .font(.system(.body, design: .rounded, weight: .medium))
                            .foregroundStyle(
                                alarmManager.selectedBuffer == buffer
                                ? Color(hex: "0a0a1a")
                                : .white.opacity(0.6)
                            )
                            .frame(width: 56, height: 36)
                            .background {
                                Capsule()
                                    .fill(
                                        alarmManager.selectedBuffer == buffer
                                        ? Color.gold
                                        : Color.white.opacity(0.08)
                                    )
                            }
                    }
                }
            }
        }
    }
}

// MARK: - Color Extension

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

// MARK: - Preview

#Preview {
    ContentView()
}
