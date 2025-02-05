import VehicleForm from './components/VehicleForm';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-md mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Find Your Vehicle</h1>
        <VehicleForm />
      </div>
    </div>
  );
}
