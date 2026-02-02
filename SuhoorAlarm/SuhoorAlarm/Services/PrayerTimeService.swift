import Foundation
import CoreLocation

// MARK: - Calculation Method

enum CalculationMethod: String, CaseIterable, Identifiable, Codable {
    case muslimWorldLeague = "Muslim World League"
    case isna = "ISNA"
    case egyptian = "Egyptian General Authority"
    case ummAlQura = "Umm al-Qura (Makkah)"
    case karachi = "University of Karachi"
    case tehran = "Tehran"
    case jafari = "Jafari"
    case singapore = "Singapore"
    case turkey = "Turkey (Diyanet)"
    case dubai = "Dubai"

    var id: String { rawValue }

    /// Fajr angle in degrees below the horizon
    var fajrAngle: Double {
        switch self {
        case .muslimWorldLeague: return 18.0
        case .isna:              return 15.0
        case .egyptian:          return 19.5
        case .ummAlQura:         return 18.5
        case .karachi:           return 18.0
        case .tehran:            return 17.7
        case .jafari:            return 16.0
        case .singapore:         return 20.0
        case .turkey:            return 18.0
        case .dubai:             return 18.2
        }
    }

    /// Isha angle in degrees below the horizon (not primary for this app, but included for completeness)
    var ishaAngle: Double {
        switch self {
        case .muslimWorldLeague: return 17.0
        case .isna:              return 15.0
        case .egyptian:          return 17.5
        case .ummAlQura:         return 90.0 // minutes after Maghrib
        case .karachi:           return 18.0
        case .tehran:            return 14.0
        case .jafari:            return 14.0
        case .singapore:         return 18.0
        case .turkey:            return 17.0
        case .dubai:             return 18.2
        }
    }
}

// MARK: - Prayer Time Service

final class PrayerTimeService {

    static let shared = PrayerTimeService()
    private init() {}

    // MARK: - Public

    /// Calculate Fajr time for a given date and location
    func fajrTime(
        for date: Date,
        coordinate: CLLocationCoordinate2D,
        method: CalculationMethod
    ) -> Date? {
        let calendar = Calendar.current
        let components = calendar.dateComponents([.year, .month, .day], from: date)
        guard let year = components.year,
              let month = components.month,
              let day = components.day else { return nil }

        let jd = julianDay(year: year, month: month, day: day)
        let latitude = coordinate.latitude
        let longitude = coordinate.longitude

        // Sun declination and equation of time
        let (declination, eqOfTime) = sunPosition(julianDay: jd)

        // Solar noon in hours (UTC)
        let solarNoon = 12.0 - eqOfTime / 60.0 - longitude / 15.0

        // Fajr hour angle
        let fajrAngle = method.fajrAngle
        guard let fajrHA = hourAngle(latitude: latitude, declination: declination, angle: fajrAngle) else {
            return nil
        }

        // Fajr time in hours (UTC)
        let fajrUTC = solarNoon - fajrHA / 15.0

        // Convert to local Date
        let timeZone = TimeZone.current
        let utcOffset = Double(timeZone.secondsFromGMT(for: date)) / 3600.0

        let fajrLocal = fajrUTC + utcOffset

        // Build the final date
        var fajrComponents = DateComponents()
        fajrComponents.year = year
        fajrComponents.month = month
        fajrComponents.day = day
        fajrComponents.hour = Int(fajrLocal)
        fajrComponents.minute = Int((fajrLocal - Double(Int(fajrLocal))) * 60.0)
        fajrComponents.second = Int(((fajrLocal - Double(Int(fajrLocal))) * 60.0 - Double(Int((fajrLocal - Double(Int(fajrLocal))) * 60.0))) * 60.0)
        fajrComponents.timeZone = timeZone

        return calendar.date(from: fajrComponents)
    }

    /// Calculate Fajr for today and tomorrow, returning the next upcoming Fajr
    func nextFajrTime(
        coordinate: CLLocationCoordinate2D,
        method: CalculationMethod
    ) -> Date? {
        let now = Date()
        let calendar = Calendar.current

        // Try today
        if let todayFajr = fajrTime(for: now, coordinate: coordinate, method: method),
           todayFajr > now {
            return todayFajr
        }

        // Try tomorrow
        guard let tomorrow = calendar.date(byAdding: .day, value: 1, to: now) else { return nil }
        return fajrTime(for: tomorrow, coordinate: coordinate, method: method)
    }

    // MARK: - Astronomical Calculations

    /// Julian Day Number from a calendar date
    private func julianDay(year: Int, month: Int, day: Int) -> Double {
        var y = Double(year)
        var m = Double(month)
        let d = Double(day) + 0.5 // noon

        if m <= 2 {
            y -= 1
            m += 12
        }

        let a = floor(y / 100.0)
        let b = 2 - a + floor(a / 4.0)

        return floor(365.25 * (y + 4716)) + floor(30.6001 * (m + 1)) + d + b - 1524.5
    }

    /// Sun declination (degrees) and equation of time (minutes) for a Julian Day
    private func sunPosition(julianDay jd: Double) -> (declination: Double, eqOfTime: Double) {
        let d = jd - 2451545.0 // days since J2000.0

        // Mean longitude (degrees)
        let L0 = (280.46646 + 0.9856474 * d).truncatingRemainder(dividingBy: 360.0)

        // Mean anomaly (degrees)
        let M = (357.52911 + 0.98560028 * d).truncatingRemainder(dividingBy: 360.0)
        let mRad = M * .pi / 180.0

        // Equation of center
        let C = (1.9146 - 0.004817 * d / 36525.0) * sin(mRad)
            + 0.019993 * sin(2 * mRad)
            + 0.00029 * sin(3 * mRad)

        // Sun's true longitude
        let sunLon = L0 + C

        // Obliquity of the ecliptic
        let obliquity = 23.439 - 0.00000036 * d
        let oblRad = obliquity * .pi / 180.0

        // Sun declination
        let sunLonRad = sunLon * .pi / 180.0
        let declination = asin(sin(oblRad) * sin(sunLonRad)) * 180.0 / .pi

        // Equation of time
        let y2 = tan(oblRad / 2.0) * tan(oblRad / 2.0)
        let l0Rad = L0 * .pi / 180.0
        let eqOfTime = 4.0 * (y2 * sin(2 * l0Rad)
            - 2.0 * sin(mRad) * 0.98560028 / 0.9856474
            + 4.0 * sin(mRad) * y2 * cos(2 * l0Rad) * 0.98560028 / 0.9856474
        ) * 180.0 / .pi

        // Simplified equation of time
        let eot = -1.0 * equationOfTimeSimplfied(d: d)

        return (declination, eot)
    }

    /// Simplified equation of time in minutes
    private func equationOfTimeSimplfied(d: Double) -> Double {
        let b = 2.0 * .pi * (d + 10) / 365.25
        // Equation of time in minutes
        return -7.655 * sin(b) + 9.873 * sin(2 * b + 3.5932)
    }

    /// Hour angle for a given angle below the horizon
    /// Returns nil if the sun never reaches this angle (polar regions)
    private func hourAngle(latitude: Double, declination: Double, angle: Double) -> Double? {
        let latRad = latitude * .pi / 180.0
        let declRad = declination * .pi / 180.0
        let angleRad = angle * .pi / 180.0

        let cosHA = (sin(-angleRad) - sin(latRad) * sin(declRad))
            / (cos(latRad) * cos(declRad))

        guard cosHA >= -1.0 && cosHA <= 1.0 else { return nil }

        return acos(cosHA) * 180.0 / .pi
    }
}
