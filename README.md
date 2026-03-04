# TrustLens: Automated ML Model Auditing System

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.8+](https://img.shields.io/badge/python-3.8+-blue.svg)](https://www.python.org/downloads/)
[![React](https://img.shields.io/badge/react-18+-61dafb.svg)](https://react.dev/)

> An automated platform for auditing machine learning models with comprehensive trust and reliability analysis.

## 🎯 Overview

TrustLens is a unified platform designed to evaluate machine learning models across multiple critical dimensions: **explainability**, **fairness**, **robustness**, **data drift**, and **confidence calibration**. It generates professional audit reports with a trust score, making responsible AI evaluation accessible to students, practitioners, and organizations.

### Key Features

- 🔍 **Explainability Analysis** - Understand model decisions using SHAP
- ⚖️ **Bias & Fairness Detection** - Identify and quantify fairness issues
- 🛡️ **Robustness Testing** - Evaluate model resilience against adversarial inputs
- 📊 **Data Drift Detection** - Monitor for distribution shifts over time
- 📈 **Confidence Calibration** - Assess prediction confidence reliability
- 📋 **Automated Reports** - Generate professional PDF audit reports
- 🎨 **Interactive Dashboard** - Visualize metrics and insights
- 👥 **User-Friendly Interface** - No technical expertise required

## 🚀 Quick Start

### Prerequisites

- Python 3.8 or higher
- Node.js 16+ (for frontend)
- Docker (optional, for containerized deployment)

### Installation

#### Backend Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/trustlens.git
cd trustlens

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

#### Frontend Setup

```bash
cd Frontend

# Install dependencies
npm install
# or
pnpm install

# Start development server
npm run dev
```

### Running the Application

```bash
# Start backend API
uvicorn main:app --reload

# In another terminal, start frontend
cd Frontend
npm run dev
```

Visit `http://localhost:3000` to access the dashboard.

## 📋 Project Structure

```
trustlens/
├── Frontend/                    # React-based user interface
│   ├── app/                    # Next.js app directory
│   │   ├── dashboard/          # Dashboard pages
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Home page
│   ├── components/             # Reusable React components
│   │   ├── ui/                 # UI component library
│   │   └── [feature]/          # Feature-specific components
│   ├── hooks/                  # Custom React hooks
│   ├── lib/                    # Utility functions
│   └── package.json            # Frontend dependencies
├── backend/                    # FastAPI backend (to be created)
│   ├── app/
│   ├── modules/
│   │   ├── explainability/     # SHAP-based analysis
│   │   ├── fairness/           # Bias detection
│   │   ├── robustness/         # Adversarial testing
│   │   ├── drift/              # Data drift detection
│   │   └── calibration/        # Confidence calibration
│   └── main.py                 # FastAPI entry point
├── docker/                     # Docker configuration
├── docs/                       # Documentation
└── README.md                   # This file
```

## 🏗️ Architecture

### System Components

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (React)                      │
│              Interactive Dashboard & UI                  │
└────────────────────┬────────────────────────────────────┘
                     │ REST API
┌────────────────────▼────────────────────────────────────┐
│                  Backend (FastAPI)                       │
├─────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │Explainability│  │   Fairness   │  │  Robustness  │  │
│  │   (SHAP)     │  │  Detection   │  │   Testing    │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  Data Drift  │  │ Calibration  │  │Report Engine │  │
│  │  Detection   │  │  Evaluation  │  │  (PDF Gen)   │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│              Model & Data Storage                        │
│         (SQLite/PostgreSQL + File Storage)              │
└─────────────────────────────────────────────────────────┘
```

## 📊 Audit Modules

### 1. Explainability Analysis
- Feature importance ranking
- SHAP value visualization
- Decision path analysis
- Model behavior interpretation

### 2. Bias & Fairness Detection
- Demographic parity analysis
- Equalized odds evaluation
- Disparate impact assessment
- Protected attribute analysis

### 3. Robustness Testing
- Adversarial perturbation testing
- Input noise tolerance evaluation
- Model stability assessment
- Edge case identification

### 4. Data Drift Detection
- Distribution shift monitoring
- Feature drift analysis
- Concept drift detection
- Statistical tests (KS, Wasserstein)

### 5. Confidence Calibration
- Calibration curve analysis
- Expected calibration error (ECE)
- Brier score evaluation
- Confidence reliability assessment

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18, Next.js, TypeScript | User interface & dashboard |
| **Backend** | FastAPI, Python 3.8+ | REST API & core logic |
| **ML/AI** | Scikit-learn, PyTorch | Model evaluation & testing |
| **Explainability** | SHAP | Feature importance & interpretability |
| **Visualization** | Plotly, Matplotlib | Charts & graphs |
| **Database** | SQLite/PostgreSQL | Data persistence |
| **Deployment** | Docker, Docker Compose | Containerization |
| **Styling** | Tailwind CSS | UI styling |

## 📖 Usage Guide

### Uploading a Model

1. Navigate to the **Upload** section
2. Select your trained model file (`.pkl`, `.joblib`, `.pt`)
3. Upload corresponding dataset (CSV format)
4. Configure audit parameters
5. Click "Start Audit"

### Viewing Audit Results

1. Go to **Results** dashboard
2. Review comprehensive audit metrics
3. Explore interactive visualizations
4. Check trust score and recommendations
5. Download PDF report

### Interpreting the Trust Score

The trust score (0-100) combines:
- **Explainability** (25%) - Model interpretability
- **Fairness** (25%) - Absence of bias
- **Robustness** (20%) - Resilience to perturbations
- **Calibration** (15%) - Confidence reliability
- **Drift Risk** (15%) - Data stability

## 🧪 Testing

### Running Tests

```bash
# Backend tests
pytest backend/tests/ -v

# Frontend tests
npm run test

# Property-based tests
pytest backend/tests/ -v --pbt
```

### Test Coverage

- Unit tests for all audit modules
- Integration tests for API endpoints
- Property-based tests for core algorithms
- End-to-end tests for user workflows

## 📦 Deployment

### Docker Deployment

```bash
# Build Docker image
docker build -t trustlens:latest .

# Run container
docker run -p 8000:8000 -p 3000:3000 trustlens:latest
```

### Cloud Deployment

Deployment guides available for:
- AWS (EC2, ECS, Lambda)
- Google Cloud Platform
- Azure
- Heroku

See [DEPLOYMENT.md](docs/DEPLOYMENT.md) for detailed instructions.

## 📚 Documentation

- [User Guide](docs/USER_GUIDE.md) - How to use TrustLens
- [API Documentation](docs/API.md) - REST API reference
- [Architecture Guide](docs/ARCHITECTURE.md) - System design details
- [Contributing Guide](CONTRIBUTING.md) - How to contribute
- [Technical Documentation](docs/TECHNICAL.md) - Implementation details

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on:
- Code style and standards
- Pull request process
- Issue reporting
- Development setup

## 📋 Roadmap

### Phase 1: Foundation ✅
- [x] System architecture design
- [x] Frontend scaffolding
- [ ] Backend API setup

### Phase 2: Core Modules 🚧
- [ ] Explainability engine (SHAP integration)
- [ ] Fairness detection module
- [ ] Robustness testing framework
- [ ] Data drift detection

### Phase 3: Integration
- [ ] Module integration
- [ ] API endpoint development
- [ ] Dashboard implementation

### Phase 4: Enhancement
- [ ] Advanced visualizations
- [ ] Report generation
- [ ] Performance optimization

### Phase 5: Deployment
- [ ] Docker containerization
- [ ] Cloud deployment
- [ ] Production hardening

## 🎓 Use Cases

- **Academic Projects** - Evaluate ML coursework assignments
- **Pre-Deployment Testing** - Validate models before production
- **Fairness Audits** - Assess bias in recruitment/finance systems
- **Healthcare Validation** - Ensure model reliability in medical applications
- **Educational Tool** - Learn responsible AI practices
- **Compliance** - Meet regulatory requirements (GDPR, AI Act)

## ⚖️ License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Project Team** - TrustLens Development Team

## 🙏 Acknowledgments

- SHAP library for explainability
- Scikit-learn for ML utilities
- FastAPI for backend framework
- React community for frontend tools
- All contributors and testers

## 📞 Support & Contact

- **Issues** - [GitHub Issues](https://github.com/yourusername/trustlens/issues)
- **Discussions** - [GitHub Discussions](https://github.com/yourusername/trustlens/discussions)
- **Email** - support@trustlens.dev
- **Documentation** - [docs/](docs/)

## 🔐 Security

For security concerns, please email security@trustlens.dev instead of using the issue tracker.

---

**Made with ❤️ for responsible and transparent AI**

*Last Updated: March 2026*
