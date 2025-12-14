import { Button } from "./components/ui/button";

const App = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 min-w-screen">
      <div className="flex flex-col gap-4">
        <p>Hello world</p>
        <Button className="text-black">Click me</Button>
      </div>
    </div>
  );
};

export default App;
