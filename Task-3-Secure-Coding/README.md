# Secure Coding Review


## 1. Project Overview


This project demonstrates a security-focused code review of a Python Flask web application.


The application was intentionally created with common security vulnerabilities so that they could be identified using static analysis and manual code inspection.


After identifying the vulnerabilities, secure coding practices were applied to remediate the issues.


The application was then scanned again using Bandit to verify the security improvements.


---


## 2. Objective


The main objectives of this project are:


- Select and review a Python Flask application.
- Identify security vulnerabilities through code review.
- Use a static security analysis tool.
- Understand the security impact of identified vulnerabilities.
- Apply secure coding practices.
- Document vulnerabilities and remediation steps.
- Re-scan the application after fixing the issues.
- Verify that the application continues to work correctly.


---


## 3. Technologies Used


- Python
- Flask
- SQLite
- Bandit
- Visual Studio Code
- Windows PowerShell


---


## 4. Project Structure


```text
SECURE CODING/
│
├── vulnerable_app.py
├── users.db
├── security_report.txt
└── README.md

vulnerable_app.py contains the Flask application and the secure implementation.

The original vulnerable implementations are preserved as comments next to the corresponding secure code for comparison and documentation.

5. Application Description

The application is a small Flask-based web application containing:

Login functionality
SQLite database
Password handling
Search functionality
Network ping functionality
Flask web routes

The application was intentionally designed to contain security weaknesses for the purpose of security testing and secure coding practice.

6. Initial Vulnerabilities

The first version of the application contained multiple security issues.

The initial Bandit scan identified:

High:   2
Medium: 1
Low:    2

The important findings included:

Hardcoded secret
SQL Injection risk
Command Injection risk
Flask debug mode enabled
Unsafe subprocess usage
7. Vulnerability 1 – Hardcoded Secret
Vulnerable Code

The original application contained a secret directly inside the source code:

SECRET_KEY = "SuperSecret123"
Security Problem

Hardcoding secrets in source code can expose sensitive credentials if the source code is shared, uploaded to a repository, or accessed by an unauthorized person.

Bandit identified this issue as:

B105: hardcoded_password_string
Remediation

The secret was changed to be loaded from an environment variable:

SECRET_KEY = os.environ.get(
    "SECRET_KEY",
    "development-only-secret"
)

This prevents the actual secret from being directly stored in the source code.

8. Vulnerability 2 – SQL Injection
Vulnerable Code

The original login functionality constructed the SQL query using string formatting:

query = f"""
    SELECT * FROM users
    WHERE username = '{username}'
    AND password = '{password}'
"""


cursor.execute(query)
Security Problem

User input was directly inserted into the SQL statement.

This can allow specially crafted input to modify the intended SQL query.

Bandit identified this as:

B608: hardcoded_sql_expressions

This finding was associated with:

CWE-89: SQL Injection
Remediation

A parameterized SQL query was used:

query = """
    SELECT * FROM users
    WHERE username = ? AND password = ?
"""


cursor.execute(
    query,
    (username, password_hash)
)

The username and password are now passed separately from the SQL statement.

This prevents user input from being interpreted as SQL syntax.

9. Vulnerability 3 – Command Injection
Vulnerable Code

The original application used user input with a shell command:

subprocess.check_output(
    f"ping -n 1 {host}",
    shell=True,
    text=True
)
Security Problem

Using shell=True with user-controlled input can create a command injection risk.

An attacker could potentially manipulate the input so that additional operating-system commands are interpreted by the shell.

Bandit identified this as:

B602: subprocess_popen_with_shell_equals_true

This finding was associated with:

CWE-78: OS Command Injection
Remediation

The command was changed so that the arguments are passed separately:

subprocess.check_output(
    ["ping", "-n", "1", host],
    text=True,
    timeout=5
)

shell=True was removed.

Input validation was also added to restrict the allowed host input.

This significantly reduces the risk of shell command injection.

10. Vulnerability 4 – Plaintext Password Storage
Vulnerable Approach

The initial application used a password directly for authentication.

Storing passwords in plaintext is unsafe because anyone who gains access to the database could read the actual passwords.

Remediation

The application was modified to store a password hash instead of the plaintext password.

Conceptually:

password_hash = hash_password(password)

During login, the supplied password is processed and compared with the stored password representation.

This prevents the database from directly containing the user's plaintext password.

11. Vulnerability 5 – Flask Debug Mode
Vulnerable Code

The original application used:

app.run(debug=True)
Security Problem

Flask debug mode should not be enabled in a production environment.

The Werkzeug debugger can expose sensitive debugging information and may create serious security risks.

Bandit identified:

B201: flask_debug_true
Remediation

Debug mode was disabled:

app.run(debug=False)
12. XSS Protection

The application also uses safe template rendering for user-controlled search input.

Instead of directly inserting user input into HTML, the application passes the value to a template:

return render_template_string("""
    <h2>Search Results</h2>
    <p>You searched for: {{ query }}</p>
""", query=query)

Template escaping helps prevent user input from being interpreted as executable HTML or JavaScript.

13. Static Security Analysis

Bandit was used as the static security analyzer.

The initial scan was performed using:

python -m bandit -r vulnerable_app.py

The initial scan identified:

High:   2
Medium: 1
Low:    2

A security report was also generated using:

python -m bandit -r vulnerable_app.py -f txt -o security_report.txt
14. Remediation Process

The security review followed this process:

Source Code
     ↓
Manual Code Review
     ↓
Bandit Security Scan
     ↓
Vulnerabilities Identified
     ↓
Security Remediation
     ↓
Application Testing
     ↓
Bandit Re-scan
     ↓
Final Verification
15. Before vs After
Security Issue	Before	After
Hardcoded Secret	Secret stored in source code	Environment variable
SQL Injection	String-based SQL query	Parameterized query
Command Injection	shell=True	Arguments passed separately
Password Storage	Plaintext approach	Password hashing
Flask Debug	debug=True	debug=False
XSS	Unsafe direct HTML insertion	Template escaping
16. Final Security Scan

After remediation, Bandit was executed again:

python -m bandit -r vulnerable_app.py

The final scan showed:

High:   0
Medium: 0
Low:    3

The High and Medium severity findings identified during the initial review were therefore resolved.

The remaining Low severity findings were related to the use of the subprocess module and its safe invocation. These are security-review warnings rather than the original high/medium vulnerabilities.

17. Application Testing

After applying the security fixes, the application was tested manually.

The login functionality was tested using the configured test account.

The application successfully processed the login request and continued to operate after the security changes.

This confirmed that the remediation did not break the main application functionality.

18. Security Best Practices Applied

The following secure coding practices were applied:

Never hardcode sensitive secrets.
Use environment variables for application secrets.
Use parameterized SQL queries.
Never construct SQL queries directly from user input.
Avoid shell=True when processing user-controlled input.
Validate and restrict user input.
Never store passwords in plaintext.
Use password hashing.
Disable Flask debug mode outside development.
Escape user-controlled output before rendering it as HTML.
Use static security analysis tools during development.
Perform security testing again after remediation.
19. Limitations

This project is an educational secure coding review and is not a complete production security audit.

Bandit performs static analysis and therefore cannot identify every possible application vulnerability.

Additional security testing would be required for a production application, including:

Dynamic application security testing
Dependency vulnerability scanning
Authentication testing
Authorization testing
Session security testing
Configuration review
Manual penetration testing
20. Security and Ethical Considerations

The application was created for educational security testing.

Security testing should only be performed on applications and systems where permission has been provided.

The techniques demonstrated in this project should be used for defensive security, secure development and authorized testing.

21. Conclusion

The Secure Coding Review project demonstrated the process of identifying and fixing common security vulnerabilities in a Python Flask application.

The application was first analyzed using manual code review and Bandit.

The review identified security issues including:

SQL Injection
Command Injection
Hardcoded secrets
Unsafe password handling
Flask debug mode
Potential XSS

Secure coding techniques were then applied to remediate these issues.

After remediation, the application was tested again and Bandit was re-run.

The final scan reduced the High and Medium severity findings to zero.

This project demonstrates the importance of integrating security into the software development process rather than treating security as a final step.
