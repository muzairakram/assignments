import Foundation
import CoreLocation
import Combine

final class LocationService: NSObject, ObservableObject {

    static let shared = LocationService()

    @Published var coordinate: CLLocationCoordinate2D?
    @Published var cityName: String = "—"
    @Published var countryName: String = "—"
    @Published var authorizationStatus: CLAuthorizationStatus = .notDetermined
    @Published var isLocating: Bool = false

    private let manager = CLLocationManager()
    private let geocoder = CLGeocoder()

    private override init() {
        super.init()
        manager.delegate = self
        manager.desiredAccuracy = kCLLocationAccuracyKilometer
        loadSavedLocation()
    }

    // MARK: - Public

    func requestPermission() {
        manager.requestWhenInUseAuthorization()
    }

    func requestLocation() {
        isLocating = true
        manager.requestLocation()
    }

    // MARK: - Persistence

    private func saveLocation(_ coord: CLLocationCoordinate2D) {
        UserDefaults.standard.set(coord.latitude, forKey: "savedLatitude")
        UserDefaults.standard.set(coord.longitude, forKey: "savedLongitude")
    }

    private func loadSavedLocation() {
        let lat = UserDefaults.standard.double(forKey: "savedLatitude")
        let lon = UserDefaults.standard.double(forKey: "savedLongitude")
        if lat != 0 || lon != 0 {
            coordinate = CLLocationCoordinate2D(latitude: lat, longitude: lon)
            cityName = UserDefaults.standard.string(forKey: "savedCity") ?? "—"
            countryName = UserDefaults.standard.string(forKey: "savedCountry") ?? "—"
        }
    }

    private func reverseGeocode(_ location: CLLocation) {
        geocoder.reverseGeocodeLocation(location) { [weak self] placemarks, _ in
            guard let self, let place = placemarks?.first else { return }
            DispatchQueue.main.async {
                self.cityName = place.locality ?? place.administrativeArea ?? "Unknown"
                self.countryName = place.country ?? "Unknown"
                UserDefaults.standard.set(self.cityName, forKey: "savedCity")
                UserDefaults.standard.set(self.countryName, forKey: "savedCountry")
            }
        }
    }

    var coordinateString: String {
        guard let c = coordinate else { return "—" }
        return String(format: "%.4f, %.4f", c.latitude, c.longitude)
    }
}

// MARK: - CLLocationManagerDelegate

extension LocationService: CLLocationManagerDelegate {

    func locationManager(_ manager: CLLocationManager, didChangeAuthorization status: CLAuthorizationStatus) {
        DispatchQueue.main.async {
            self.authorizationStatus = status
        }
        if status == .authorizedWhenInUse || status == .authorizedAlways {
            requestLocation()
        }
    }

    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        guard let location = locations.last else { return }
        DispatchQueue.main.async {
            self.coordinate = location.coordinate
            self.isLocating = false
            self.saveLocation(location.coordinate)
            self.reverseGeocode(location)
        }
    }

    func locationManager(_ manager: CLLocationManager, didFailWithError error: Error) {
        DispatchQueue.main.async {
            self.isLocating = false
        }
    }
}
