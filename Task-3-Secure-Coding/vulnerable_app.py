from flask import Flask, request, render_template_string
import sqlite3
import subprocess
import os
import hashlib

app = Flask(__name__)

# ==================== BEFORE: VULNERABLE CODE ====================
# Hardcoded secret: the secret was directly stored in source code.
# SECRET_KEY = "SuperSecret123"
# ================================================================

# AFTER: SECURE CODE
# Secret is loaded from an environment variable instead of hardcoding it.
SECRET_KEY = os.environ.get("SECRET_KEY", "development-only-secret")


def get_db():
    conn = sqlite3.connect("users.db")
    return conn


def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()


# Create database
def init_db():
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            password TEXT
        )
    """)

    # ==================== BEFORE: VULNERABLE CODE ====================
    # The original version stored the password directly.
    # cursor.execute("""
    #     INSERT OR IGNORE INTO users (id, username, password)
    #     VALUES (1, 'admin', 'admin123')
    # """)
    # ================================================================

    # AFTER: SECURE CODE
    # Store a hash instead of the plaintext password.
    password_hash = hash_password("admin123")

    cursor.execute("""
        INSERT OR IGNORE INTO users (id, username, password)
        VALUES (?, ?, ?)
    """, (1, "admin", password_hash))

    conn.commit()
    conn.close()


# Secure login with parameterized SQL query
@app.route("/login", methods=["GET", "POST"])
def login():
    message = ""

    if request.method == "POST":
        username = request.form.get("username", "")
        password = request.form.get("password", "")

        password_hash = hash_password(password)

        conn = get_db()
        cursor = conn.cursor()

        # ==================== BEFORE: VULNERABLE CODE ====================
        # User input was directly inserted into the SQL statement.
        # query = f"""
        #     SELECT * FROM users
        #     WHERE username = '{username}'
        #     AND password = '{password}'
        # """
        # cursor.execute(query)
        # This created a SQL Injection risk.
        # ================================================================

        # AFTER: SECURE CODE
        # Parameterized query keeps user input separate from SQL code.
        query = """
            SELECT * FROM users
            WHERE username = ? AND password = ?
        """

        cursor.execute(query, (username, password_hash))
        user = cursor.fetchone()

        conn.close()

        if user:
            message = "Login successful!"
        else:
            message = "Invalid username or password."

    return render_template_string("""
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SecureVault | Login</title>

    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: Arial, sans-serif;
        }

        body {
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            background:
                radial-gradient(circle at 20% 20%, rgba(0, 255, 170, 0.12), transparent 30%),
                radial-gradient(circle at 80% 80%, rgba(0, 120, 255, 0.12), transparent 30%),
                #050b12;
            color: white;
            overflow: hidden;
        }

        .background-grid {
            position: fixed;
            inset: 0;
            background-image:
                linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
            background-size: 45px 45px;
            pointer-events: none;
        }

        .login-wrapper {
            width: 920px;
            max-width: 92%;
            min-height: 560px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            background: rgba(10, 20, 30, 0.82);
            border: 1px solid rgba(0, 255, 170, 0.18);
            border-radius: 24px;
            overflow: hidden;
            box-shadow:
                0 25px 80px rgba(0, 0, 0, 0.65),
                0 0 50px rgba(0, 255, 170, 0.05);
            backdrop-filter: blur(20px);
            position: relative;
            z-index: 2;
        }

        .brand-section {
            padding: 55px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            background:
                linear-gradient(
                    135deg,
                    rgba(0, 255, 170, 0.08),
                    rgba(0, 100, 255, 0.05)
                );
            border-right: 1px solid rgba(255,255,255,0.06);
        }

        .logo {
            width: 70px;
            height: 70px;
            border-radius: 18px;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 34px;
            background: rgba(0, 255, 170, 0.08);
            border: 1px solid rgba(0,255,170,0.35);
            box-shadow: 0 0 30px rgba(0,255,170,0.12);
            margin-bottom: 28px;
        }

        .brand-section h1 {
            font-size: 38px;
            letter-spacing: -1px;
            margin-bottom: 12px;
        }

        .brand-section h1 span {
            color: #00ffaa;
        }

        .brand-section p {
            color: #91a1b2;
            line-height: 1.7;
            max-width: 360px;
            font-size: 15px;
        }

        .security-status {
            margin-top: 35px;
            display: flex;
            align-items: center;
            gap: 10px;
            color: #8fe8c8;
            font-size: 13px;
        }

        .status-dot {
            width: 9px;
            height: 9px;
            background: #00ffaa;
            border-radius: 50%;
            box-shadow: 0 0 12px #00ffaa;
        }

        .login-section {
            padding: 55px;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }

        .login-section h2 {
            font-size: 29px;
            margin-bottom: 8px;
        }

        .subtitle {
            color: #758596;
            font-size: 14px;
            margin-bottom: 35px;
        }

        .input-group {
            margin-bottom: 20px;
        }

        .input-group label {
            display: block;
            font-size: 13px;
            color: #b7c3cf;
            margin-bottom: 9px;
        }

        .input-wrapper {
            position: relative;
        }

        .input-icon {
            position: absolute;
            left: 15px;
            top: 50%;
            transform: translateY(-50%);
            color: #657789;
            font-size: 16px;
        }

        input {
            width: 100%;
            padding: 14px 15px 14px 44px;
            background: rgba(255,255,255,0.035);
            border: 1px solid rgba(255,255,255,0.09);
            border-radius: 12px;
            color: white;
            outline: none;
            transition: 0.25s;
            font-size: 14px;
        }

        input::placeholder {
            color: #536373;
        }

        input:focus {
            border-color: #00ffaa;
            box-shadow: 0 0 0 3px rgba(0,255,170,0.08);
            background: rgba(0,255,170,0.025);
        }

        .login-btn {
            width: 100%;
            border: none;
            padding: 15px;
            margin-top: 8px;
            border-radius: 12px;
            background: linear-gradient(135deg, #00ffaa, #00c98a);
            color: #03100b;
            font-size: 15px;
            font-weight: 700;
            cursor: pointer;
            transition: 0.25s;
            box-shadow: 0 8px 25px rgba(0,255,170,0.15);
        }

        .login-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 30px rgba(0,255,170,0.25);
        }

        .login-btn:active {
            transform: translateY(0);
        }

        .message {
            margin-top: 20px;
            padding: 12px;
            border-radius: 10px;
            text-align: center;
            background: rgba(255,255,255,0.04);
            color: #9ee8cf;
            font-size: 13px;
        }

        .footer {
            margin-top: 28px;
            text-align: center;
            color: #536373;
            font-size: 11px;
        }

        .footer span {
            color: #00ffaa;
        }

        @media (max-width: 750px) {
            .login-wrapper {
                grid-template-columns: 1fr;
                min-height: auto;
            }

            .brand-section {
                display: none;
            }

            .login-section {
                padding: 40px 28px;
            }
        }
    </style>
</head>

<body>

    <div class="background-grid"></div>

    <div class="login-wrapper">

        <div class="brand-section">

            <div class="logo">🛡️</div>

            <h1>Secure<span>Vault</span></h1>

            <p>
                A security-focused authentication platform
                designed with secure coding principles and
                modern application security practices.
            </p>

            <div class="security-status">
                <span class="status-dot"></span>
                Security systems operational
            </div>

        </div>


        <div class="login-section">

            <h2>Welcome back</h2>

            <p class="subtitle">
                Sign in to access your secure dashboard.
            </p>

            <form method="POST">

                <div class="input-group">
                    <label>Username</label>

                    <div class="input-wrapper">
                        <span class="input-icon">◉</span>

                        <input
                            type="text"
                            name="username"
                            placeholder="Enter your username"
                            autocomplete="username"
                            required
                        >
                    </div>
                </div>


                <div class="input-group">
                    <label>Password</label>

                    <div class="input-wrapper">
                        <span class="input-icon">●</span>

                        <input
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            autocomplete="current-password"
                            required
                        >
                    </div>
                </div>


                <button type="submit" class="login-btn">
                    Sign In Securely →
                </button>

            </form>


            {% if message %}
                <div class="message">
                    {{ message }}
                </div>
            {% endif %}


            <div class="footer">
                Protected by <span>Secure Coding</span> practices
            </div>

        </div>

    </div>

</body>
</html>
""", message=message)


# Secure ping endpoint
@app.route("/ping")
def ping():
    host = request.args.get("host", "127.0.0.1")

    # Basic input validation
    if not all(
        character.isalnum() or character in ".:-"
        for character in host
    ):
        return "Invalid host input.", 400

    # ==================== BEFORE: VULNERABLE CODE ====================
    # User-controlled input was placed directly into a shell command.
    # result = subprocess.check_output(
    #     f"ping -n 1 {host}",
    #     shell=True,
    #     text=True
    # )
    # This created a Command Injection risk.
    # ================================================================

    try:
        # AFTER: SECURE CODE
        # No shell=True; command and arguments are passed separately.
        result = subprocess.check_output(
            ["ping", "-n", "1", host],
            text=True,
            timeout=5
        )

        return f"<pre>{result}</pre>"

    except subprocess.CalledProcessError:
        return "Ping failed.", 400

    except subprocess.TimeoutExpired:
        return "Ping timed out.", 408


# Secure: escaped output prevents reflected XSS
@app.route("/search")
def search():
    query = request.args.get("q", "")

    return render_template_string("""
        <h2>Search Results</h2>
        <p>You searched for: {{ query }}</p>
    """, query=query)


if __name__ == "__main__":
    init_db()

    # ==================== BEFORE: VULNERABLE CODE ====================
    # Debug mode was enabled:
    # app.run(debug=True)
    # This can expose the Werkzeug debugger and sensitive information.
    # ================================================================

    # AFTER: SECURE CODE
    # Debug mode is disabled.
    app.run(debug=False)