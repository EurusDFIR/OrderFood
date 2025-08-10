import { useState } from "react";
import { Button, Card, Input, Modal, LoadingSpinner } from "@/components";

function App() {
  const [count, setCount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLoadingDemo = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold text-center mb-8 text-gradient">
          🍕 OrderFood Frontend
        </h1>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Basic Components Demo */}
          <Card
            header={<h2 className="text-xl font-semibold">Basic Components</h2>}
            className="space-y-4"
          >
            <p className="text-gray-600">Phase 1.5 Setup Complete! ✅</p>

            <div className="space-y-3">
              <Button onClick={() => setCount(count + 1)}>
                Count: {count}
              </Button>

              <Button variant="secondary" onClick={() => setCount(0)}>
                Reset
              </Button>

              <Button variant="outline" onClick={() => setShowModal(true)}>
                Open Modal
              </Button>

              <Button
                variant="ghost"
                onClick={handleLoadingDemo}
                loading={loading}
              >
                Loading Demo
              </Button>
            </div>
          </Card>

          {/* Form Components Demo */}
          <Card
            header={<h2 className="text-xl font-semibold">Form Components</h2>}
            className="space-y-4"
          >
            <Input
              label="Email"
              type="email"
              placeholder="Enter your email"
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="Enter password"
              helperText="Minimum 8 characters"
            />

            <Input
              label="Phone"
              type="tel"
              placeholder="Phone number"
              error="Invalid phone number format"
            />

            {loading && (
              <div className="flex items-center justify-center py-4">
                <LoadingSpinner size="lg" />
              </div>
            )}
          </Card>
        </div>

        {/* Tech Stack Info */}
        <Card className="mt-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-4">Tech Stack</h3>
            <div className="flex flex-wrap justify-center gap-2">
              {["React 18", "TypeScript", "Vite", "Tailwind CSS", "Axios"].map(
                (tech) => (
                  <span key={tech} className="badge badge-primary">
                    {tech}
                  </span>
                )
              )}
            </div>
          </div>
        </Card>

        {/* Modal Demo */}
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title="Demo Modal"
          footer={
            <div className="space-x-2">
              <Button variant="ghost" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button onClick={() => setShowModal(false)}>Confirm</Button>
            </div>
          }
        >
          <p className="text-gray-600">
            This is a demo modal showcasing the reusable components created in
            Phase 1.5.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Components include: Button, Card, Input, Modal, LoadingSpinner
          </p>
        </Modal>
      </div>
    </div>
  );
}

export default App;
