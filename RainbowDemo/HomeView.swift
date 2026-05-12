import SwiftUI

struct HomeView: View {
    @State private var selectedSegment: ServiceSegment = .today

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 20) {
                    HeaderCard()

                    Picker("Focus", selection: $selectedSegment) {
                        ForEach(ServiceSegment.allCases) { segment in
                            Text(segment.title).tag(segment)
                        }
                    }
                    .pickerStyle(.segmented)

                    VStack(spacing: 12) {
                        ForEach(mockTasks(for: selectedSegment)) { task in
                            TaskRow(task: task)
                        }
                    }
                }
                .padding()
            }
            .navigationTitle("Rainbow Services")
            .background(Color(.systemGroupedBackground))
        }
    }

    private func mockTasks(for segment: ServiceSegment) -> [ServiceTask] {
        switch segment {
        case .today:
            return [
                .init(title: "Welcome call check-in", subtitle: "2:00 PM · Client: James K.", status: .upNext),
                .init(title: "Medication reminder", subtitle: "4:30 PM · Client: Doris M.", status: .scheduled)
            ]
        case .upcoming:
            return [
                .init(title: "Mobility support visit", subtitle: "Tomorrow · Client: Andrea P.", status: .scheduled),
                .init(title: "Wellbeing follow-up", subtitle: "Friday · Client: New referral", status: .attention)
            ]
        }
    }
}

private struct HeaderCard: View {
    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            Text("Good afternoon, Eli")
                .font(.title2.weight(.semibold))

            Text("Today’s schedule is steady. One priority action needs review.")
                .font(.subheadline)
                .foregroundStyle(.secondary)

            Button("Review Priority") {}
                .buttonStyle(.borderedProminent)
                .tint(.indigo)
        }
        .padding()
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(
            RoundedRectangle(cornerRadius: 20, style: .continuous)
                .fill(Color(.secondarySystemGroupedBackground))
        )
    }
}

private struct TaskRow: View {
    let task: ServiceTask

    var body: some View {
        HStack(alignment: .top) {
            Image(systemName: task.status.symbol)
                .foregroundStyle(task.status.color)
                .font(.title3)
                .frame(width: 28)

            VStack(alignment: .leading, spacing: 4) {
                Text(task.title)
                    .font(.body.weight(.semibold))
                Text(task.subtitle)
                    .font(.footnote)
                    .foregroundStyle(.secondary)
            }

            Spacer()
        }
        .padding(12)
        .background(
            RoundedRectangle(cornerRadius: 14, style: .continuous)
                .fill(Color(.systemBackground))
        )
    }
}

private enum ServiceSegment: String, CaseIterable, Identifiable {
    case today
    case upcoming

    var id: String { rawValue }

    var title: String {
        switch self {
        case .today: return "Today"
        case .upcoming: return "Upcoming"
        }
    }
}

private struct ServiceTask: Identifiable {
    let id = UUID()
    let title: String
    let subtitle: String
    let status: TaskStatus
}

private enum TaskStatus {
    case upNext
    case scheduled
    case attention

    var symbol: String {
        switch self {
        case .upNext: return "clock.fill"
        case .scheduled: return "calendar"
        case .attention: return "exclamationmark.triangle.fill"
        }
    }

    var color: Color {
        switch self {
        case .upNext: return .blue
        case .scheduled: return .green
        case .attention: return .orange
        }
    }
}

#Preview {
    HomeView()
}
