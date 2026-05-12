import SwiftUI

struct KnowledgeHubView: View {
    private let topics = [
        "Client dignity and tone",
        "Escalation paths",
        "Care-note quality checklist",
        "Accessibility-first communication"
    ]

    var body: some View {
        NavigationStack {
            List(topics, id: \.self) { topic in
                NavigationLink(topic) {
                    Text("Prototype placeholder for \(topic)")
                        .navigationTitle(topic)
                        .navigationBarTitleDisplayMode(.inline)
                        .padding()
                }
            }
            .navigationTitle("Knowledge Hub")
        }
    }
}

#Preview {
    KnowledgeHubView()
}
