import {
  ArrowRight,
  Calendar,
  Clock,
  Pill,
  FileText,
  RefreshCw,
} from "lucide-react"

export default function Features() {
  return (
    <div className="min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="max-w-4xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold mb-4">How the Demo Works</h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-300">
            Experience our AI receptionist in action with a fully functional
            demo environment
          </p>
        </div>

        <div className="space-y-16">
          {/* Getting Started Section */}
          <section className="space-y-6">
            <h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
            <div className="bg-neutral-50 dark:bg-neutral-900 p-6 rounded-lg">
              <ol className="space-y-4">
                <li className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">
                      Create Your Demo Account
                    </h3>
                    <p className="text-neutral-600 dark:text-neutral-300">
                      Sign up for a demo account to access your personalized
                      testing environment. We&apos;ll automatically populate
                      your account with sample patients and appointments.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">
                      Access Your Demo Dashboard
                    </h3>
                    <p className="text-neutral-600 dark:text-neutral-300">
                      View your generated test patients, their appointments, and
                      medical histories. You can also create additional test
                      patients and appointments if desired.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">
                      Call the AI Receptionist
                    </h3>
                    <p className="text-neutral-600 dark:text-neutral-300">
                      Dial (662) 584-4415 to interact with our AI. You&apos;ll
                      need to authenticate using a test patient&apos;s
                      information to access their data.
                    </p>
                  </div>
                </li>
              </ol>
            </div>
          </section>

          {/* Features Grid */}
          <section>
            <h2 className="text-2xl font-semibold mb-6">What You Can Test</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FeatureCard
                icon={<Calendar className="w-6 h-6" />}
                title="Schedule Appointments"
                description="Book new appointments for any test patient. Watch as they appear instantly on your dashboard."
              />
              <FeatureCard
                icon={<Clock className="w-6 h-6" />}
                title="Cancel or Reschedule"
                description="Modify existing appointments through the AI and see real-time updates."
              />
              <FeatureCard
                icon={<Pill className="w-6 h-6" />}
                title="Medication Inquiries"
                description="Ask about current medications, dosages, and prescription details for any test patient."
              />
              <FeatureCard
                icon={<FileText className="w-6 h-6" />}
                title="Access Medical Notes"
                description="Review previous appointment notes and medical history through voice interaction."
              />
            </div>
          </section>

          {/* Real-time Updates Section */}
          <section className="bg-neutral-50 dark:bg-neutral-900 p-6 rounded-lg">
            <div className="flex items-start gap-6">
              <RefreshCw className="w-8 h-8 text-blue-500" />
              <div>
                <h2 className="text-xl font-semibold mb-2">
                  Real-time Dashboard Updates
                </h2>
                <p className="text-neutral-600 dark:text-neutral-300">
                  Any changes made through phone interactions with our AI are
                  instantly reflected in your demo dashboard. This allows you to
                  see the seamless integration between our voice AI and practice
                  management systems.
                </p>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="text-center">
            <a
              href="/sign-in"
              className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full transition-colors"
            >
              Start Testing Now
              <ArrowRight className="w-4 h-4" />
            </a>
          </section>
        </div>
      </main>
    </div>
  )
}

const FeatureCard = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) => (
  <div className="border border-neutral-200 dark:border-neutral-700 rounded-lg p-6 hover:shadow-lg transition-shadow">
    <div className="text-blue-500 mb-4">{icon}</div>
    <h3 className="font-semibold text-lg mb-2">{title}</h3>
    <p className="text-neutral-600 dark:text-neutral-300">{description}</p>
  </div>
)
