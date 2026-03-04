# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in TrustLens, please email **security@trustlens.dev** instead of using the issue tracker. This allows us to address the issue before it becomes public.

Please include:
- Description of the vulnerability
- Steps to reproduce (if applicable)
- Potential impact
- Suggested fix (if you have one)

We will acknowledge receipt of your report within 48 hours and provide an estimated timeline for a fix.

## Security Best Practices

### For Users

1. **Keep dependencies updated** - Regularly update TrustLens and its dependencies
2. **Use HTTPS** - Always use HTTPS when accessing TrustLens over the network
3. **Secure credentials** - Never commit API keys or credentials to version control
4. **Validate inputs** - Be cautious with model uploads and data inputs
5. **Monitor logs** - Regularly review application logs for suspicious activity

### For Developers

1. **Code Review** - All code changes require review before merging
2. **Dependency Scanning** - We use automated tools to scan for vulnerable dependencies
3. **Input Validation** - Always validate and sanitize user inputs
4. **Authentication** - Use secure authentication mechanisms
5. **Encryption** - Encrypt sensitive data in transit and at rest
6. **Secrets Management** - Never commit secrets; use environment variables

## Security Updates

- Security patches are released as soon as possible after discovery
- Critical vulnerabilities receive immediate attention
- Users are notified through GitHub security advisories
- Patches are backported to supported versions

## Supported Versions

| Version | Status | Support Until |
|---------|--------|---------------|
| 0.5.x   | Current | TBD |
| 0.4.x   | LTS | TBD |
| < 0.4.0 | Unsupported | N/A |

## Security Considerations

### Model Upload
- Validate model file format and integrity
- Scan uploaded files for malicious content
- Limit file size to prevent DoS attacks
- Store models securely with appropriate access controls

### Data Privacy
- Implement data encryption at rest
- Use HTTPS for data in transit
- Implement access controls and authentication
- Comply with data protection regulations (GDPR, CCPA, etc.)

### API Security
- Implement rate limiting
- Use API authentication (API keys, OAuth)
- Validate all inputs
- Implement CORS properly
- Use security headers (CSP, X-Frame-Options, etc.)

## Compliance

TrustLens aims to comply with:
- OWASP Top 10 security practices
- GDPR for data protection
- CCPA for privacy
- Industry-specific regulations (healthcare, finance, etc.)

## Contact

- **Security Issues**: security@trustlens.dev
- **General Questions**: support@trustlens.dev
- **GitHub Issues**: [Report non-security issues](https://github.com/yourusername/trustlens/issues)

---

Thank you for helping keep TrustLens secure!
