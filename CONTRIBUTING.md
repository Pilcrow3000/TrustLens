# Contributing to TrustLens

Thank you for your interest in contributing to TrustLens! We welcome contributions from the community and are excited to work with you.

## Code of Conduct

Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md) to ensure a welcoming and inclusive environment for all contributors.

## Getting Started

### Prerequisites

- Python 3.8+
- Node.js 16+
- Git
- Virtual environment tool (venv or conda)

### Development Setup

1. **Fork the repository**
   ```bash
   git clone https://github.com/yourusername/trustlens.git
   cd trustlens
   ```

2. **Set up backend environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   pip install -r requirements-dev.txt
   ```

3. **Set up frontend environment**
   ```bash
   cd Frontend
   npm install
   cd ..
   ```

4. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

### Code Style

- **Python**: Follow [PEP 8](https://www.python.org/dev/peps/pep-0008/)
- **JavaScript/TypeScript**: Follow [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- **Formatting**: Use `black` for Python, `prettier` for JavaScript/TypeScript

### Running Tests

```bash
# Backend tests
pytest backend/tests/ -v

# Frontend tests
npm run test

# Linting
npm run lint
```

### Commit Messages

Follow conventional commits format:

```
type(scope): subject

body

footer
```

**Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

**Example**:
```
feat(fairness): add demographic parity analysis

Implement demographic parity calculation for bias detection.
Includes unit tests and documentation.

Closes #123
```

## Submitting Changes

1. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create a Pull Request**
   - Provide a clear description of changes
   - Reference related issues
   - Include screenshots for UI changes
   - Ensure all tests pass

3. **Code Review**
   - Address reviewer feedback
   - Keep commits clean and organized
   - Update documentation as needed

## Pull Request Guidelines

- One feature/fix per PR
- Keep PRs focused and manageable
- Include tests for new functionality
- Update documentation
- Ensure CI/CD passes
- Request review from maintainers

## Reporting Issues

### Bug Reports

Include:
- Clear description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, Python version, etc.)
- Error messages/logs

### Feature Requests

Include:
- Clear description of the feature
- Use case and motivation
- Proposed implementation (if applicable)
- Potential alternatives

## Documentation

- Update README.md for user-facing changes
- Add docstrings to new functions/classes
- Update API documentation for backend changes
- Include examples for new features

## Testing Requirements

- Minimum 80% code coverage
- All tests must pass
- Include unit tests for new functions
- Include integration tests for new features
- Property-based tests for core algorithms

## Release Process

1. Update version in `package.json` and `setup.py`
2. Update `CHANGELOG.md`
3. Create release branch
4. Tag release with version
5. Create GitHub release

## Questions?

- Check existing [issues](https://github.com/yourusername/trustlens/issues)
- Review [documentation](docs/)
- Start a [discussion](https://github.com/yourusername/trustlens/discussions)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to TrustLens! 🎉
