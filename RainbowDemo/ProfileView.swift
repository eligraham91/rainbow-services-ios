import SwiftUI

struct ProfileView: View {
    var body: some View {
        NavigationStack {
            Form {
                Section("Account") {
                    LabeledContent("Team", value: "Rainbow Services")
                    LabeledContent("Role", value: "Care Coordinator")
                }

                Section("Preferences") {
                    Toggle("Daily schedule digest", isOn: .constant(true))
                    Toggle("Haptic confirmations", isOn: .constant(true))
                }
            }
            .navigationTitle("Profile")
        }
    }
}

#Preview {
    ProfileView()
}
