import './App.css'
import PDFConverter from './component/PDFConverter';

function App() {
  return (
    <div className="landing-page">
      <div className="background-decor-1"></div>
      <div className="background-decor-2"></div>

      <header className="page-header">
        <nav className="navbar">
          <div className="logo">Excel-ify</div>
        </nav>
        <div className="hero-content">
          <h1>Aurelion <span className="gradient-text">PDF to Excel</span> Converter</h1>
          <p className="header-tagline">Stop re-typing data. Start converting it instantly with our professional-grade tool.</p>
        </div>
      </header>

      <main className="main-content">
        <PDFConverter />
      </main>

      <footer className="page-footer">
        <p>© 2025 Excel-ify. Built with React & Love.</p>
      </footer>
    </div>
  )
}

export default App
