import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.config import settings
import random
import string

def generate_verification_code(length=6):
    """Generate a random numeric verification code"""
    return ''.join(random.choices(string.digits, k=length))

def send_verification_email(to_email: str, code: str, purpose: str = "registration"):
    """
    Send verification code via email
    
    Args:
        to_email: Recipient email address
        code: Verification code to send
        purpose: Either 'registration' or 'update_otp'
    """
    try:
        # Create message
        msg = MIMEMultipart('alternative')
        msg['From'] = settings.SMTP_FROM_EMAIL
        msg['To'] = to_email
        
        if purpose == "registration":
            msg['Subject'] = "UsNow - Verify Your Account"
            html_content = f"""
            <html>
                <body style="font-family: 'Courier New', monospace; background-color: #0a0a0f; color: #e0e0e0; padding: 40px;">
                    <div style="max-width: 600px; margin: 0 auto; background-color: #1a1a2e; border: 1px solid #2a2a3e; border-radius: 16px; padding: 40px;">
                        <div style="text-align: center; margin-bottom: 30px;">
                            <div style="display: inline-block; width: 50px; height: 50px; background-color: #6366f1; border-radius: 8px; margin-bottom: 20px;"></div>
                            <h1 style="color: #ffffff; font-size: 28px; margin: 0; text-transform: uppercase; letter-spacing: 2px;">UsNow Protocol</h1>
                            <p style="color: #6366f1; font-size: 10px; margin-top: 5px; letter-spacing: 4px;">IDENTITY_VERIFICATION_SYSTEM</p>
                        </div>
                        
                        <div style="background-color: #0f0f1a; border-left: 4px solid #6366f1; padding: 20px; margin: 30px 0;">
                            <p style="color: #a0a0b0; font-size: 12px; margin: 0 0 15px 0; text-transform: uppercase; letter-spacing: 2px;">VERIFICATION_CODE:</p>
                            <h2 style="color: #6366f1; font-size: 36px; margin: 0; letter-spacing: 8px; text-align: center;">{code}</h2>
                        </div>
                        
                        <p style="color: #a0a0b0; font-size: 14px; line-height: 1.6; margin: 20px 0;">
                            Enter this code to activate your UsNow account. This code will expire in <strong style="color: #ffffff;">10 minutes</strong>.
                        </p>
                        
                        <div style="background-color: #1a1a2e; border: 1px solid #2a2a3e; border-radius: 8px; padding: 15px; margin-top: 30px;">
                            <p style="color: #6366f1; font-size: 10px; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 2px;">SECURITY_NOTE:</p>
                            <p style="color: #808090; font-size: 12px; margin: 0; line-height: 1.5;">
                                Never share this code with anyone. UsNow will never ask for your verification code via phone or email.
                            </p>
                        </div>
                        
                        <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #2a2a3e;">
                            <p style="color: #505060; font-size: 10px; margin: 0; text-transform: uppercase; letter-spacing: 3px;">
                                USNOW_INFRASTRUCTURE // ESTABLISHED_2026
                            </p>
                        </div>
                    </div>
                </body>
            </html>
            """
        else:  # update_otp
            msg['Subject'] = "UsNow - Confirm Data Update"
            html_content = f"""
            <html>
                <body style="font-family: 'Courier New', monospace; background-color: #0a0a0f; color: #e0e0e0; padding: 40px;">
                    <div style="max-width: 600px; margin: 0 auto; background-color: #1a1a2e; border: 1px solid #2a2a3e; border-radius: 16px; padding: 40px;">
                        <div style="text-align: center; margin-bottom: 30px;">
                            <div style="display: inline-block; width: 50px; height: 50px; background-color: #6366f1; border-radius: 8px; margin-bottom: 20px;"></div>
                            <h1 style="color: #ffffff; font-size: 28px; margin: 0; text-transform: uppercase; letter-spacing: 2px;">Data Transmission</h1>
                            <p style="color: #6366f1; font-size: 10px; margin-top: 5px; letter-spacing: 4px;">VERIFICATION_REQUIRED</p>
                        </div>
                        
                        <div style="background-color: #0f0f1a; border-left: 4px solid #22d3ee; padding: 20px; margin: 30px 0;">
                            <p style="color: #a0a0b0; font-size: 12px; margin: 0 0 15px 0; text-transform: uppercase; letter-spacing: 2px;">ONE-TIME_PASSWORD:</p>
                            <h2 style="color: #22d3ee; font-size: 36px; margin: 0; letter-spacing: 8px; text-align: center;">{code}</h2>
                        </div>
                        
                        <p style="color: #a0a0b0; font-size: 14px; line-height: 1.6; margin: 20px 0;">
                            You are about to transmit identity data through UsNow's secure protocol. Enter this OTP to authorize the transmission.
                        </p>
                        
                        <div style="background-color: #1a1a2e; border: 1px solid #2a2a3e; border-radius: 8px; padding: 15px; margin-top: 30px;">
                            <p style="color: #22d3ee; font-size: 10px; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 2px;">PROTOCOL_REMINDER:</p>
                            <p style="color: #808090; font-size: 12px; margin: 0; line-height: 1.5;">
                                This data will only be shared with the requesting company. No cross-platform propagation will occur.
                            </p>
                        </div>
                        
                        <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #2a2a3e;">
                            <p style="color: #505060; font-size: 10px; margin: 0; text-transform: uppercase; letter-spacing: 3px;">
                                ZERO-TRUST_INFRASTRUCTURE // USNOW_V1.0
                            </p>
                        </div>
                    </div>
                </body>
            </html>
            """
        
        # Plain text fallback
        if purpose == "registration":
            text_content = f"UsNow Verification Code: {code}\n\nEnter this code to verify your account."
        else:
            text_content = f"UsNow Data Update OTP: {code}\n\nEnter this code to authorize data transmission."

        # Attach parts (Plain text first, then HTML)
        msg.attach(MIMEText(text_content, 'plain'))
        msg.attach(MIMEText(html_content, 'html'))
        
        # Send email
        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
            server.starttls()
            server.login(settings.SMTP_USERNAME, settings.SMTP_PASSWORD)
            server.send_message(msg)
        
        return True
    except Exception as e:
        print(f"Email sending failed: {e}")
        return False
