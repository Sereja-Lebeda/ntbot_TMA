import HomePage from "./components/pages/HomePage";
import ThemeProvider from "./providers/ThemeProvider";

function App() {
  return (
    <>
      <ThemeProvider>
        <HomePage />
      </ThemeProvider>
    </>
  );
}

export default App;
