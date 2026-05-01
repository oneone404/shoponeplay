import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
})

export const sendVerificationEmail = async (email: string, code: string) => {
  const mailOptions = {
    from: `"Hỗ Trợ ShopOnePlay" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: "Mã Xác Thực Thay Đổi Email - ShopOnePlay",
    html: `
      <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 500px; margin: 40px auto; padding: 40px; background-color: #ffffff; border-radius: 24px; border: 1px solid #f0f0f0; box-shadow: 0 10px 25px rgba(0,0,0,0.03);">
        <div style="text-align: center; margin-bottom: 30px;">
          <div style="display: inline-block; width: 48px; height: 48px; background-color: #A50064; border-radius: 14px; color: white; line-height: 48px; font-weight: 700; font-size: 24px; font-style: italic;">S</div>
          <p style="margin-top: 10px; font-weight: 700; letter-spacing: -0.5px; color: #111; font-size: 18px; text-transform: uppercase;">ShopOnePlay</p>
        </div>
        
        <h2 style="color: #111; font-size: 22px; font-weight: 700; text-align: center; margin-bottom: 8px; letter-spacing: -0.5px; text-transform: uppercase;">Xác thực tài khoản</h2>
        <p style="color: #666; font-size: 14px; text-align: center; margin-bottom: 30px; font-weight: 500;">Sử Dụng Mã Dưới Đây Để Xác Thực Thay Đổi Email</p>
        
        <div style="background: #f8f9fa; border-radius: 20px; padding: 32px; text-align: center; border: 1px solid #eef0f2; margin-bottom: 30px;">
          <span style="display: block; color: #999; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 12px;">Mã xác nhận 6 chữ số</span>
          <div style="font-size: 42px; font-weight: 700; letter-spacing: 12px; color: #A50064; font-family: 'Courier New', Courier, monospace; margin-left: 12px;">
            ${code}
          </div>
        </div>
        
        <div style="background: #fff8f8; border-radius: 12px; padding: 15px; border-left: 4px solid #ff4d4d; margin-bottom: 30px;">
          <p style="color: #d00; font-size: 12px; margin: 0; font-weight: 600;">Lưu ý: Mã Chỉ Có Hiệu Lực Trong Vòng 10P, Vui Lòng Không Chia Sẻ Mã Này Cho Ai Khác.</p>
        </div>
        
        <p style="color: #888; font-size: 12px; text-align: center; line-height: 1.6;">Nếu Bạn Không Thực Hiện Yêu Cầu. Vui Lòng Bỏ Qua Email Này.</p>
        
        <div style="margin-top: 40px; padding-top: 25px; border-top: 1px solid #eee; text-align: center;">
          <p style="color: #bbb; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; margin: 0;">© 2026 ShopOnePlay official</p>
          <p style="color: #ddd; font-size: 9px; margin-top: 5px;">Hệ Thống Cung Cấp Tài Khoản Game Số 1</p>
        </div>
      </div>
    `,
  }

  return transporter.sendMail(mailOptions)
}

export const sendAccountVerificationEmail = async (email: string, code: string) => {
  const mailOptions = {
    from: `"Hỗ Trợ ShopOnePlay" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: "Mã Xác Thực Email - ShopOnePlay",
    html: `
      <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 500px; margin: 40px auto; padding: 40px; background-color: #ffffff; border-radius: 24px; border: 1px solid #f0f0f0; box-shadow: 0 10px 25px rgba(0,0,0,0.03);">
        <div style="text-align: center; margin-bottom: 30px;">
          <div style="display: inline-block; width: 48px; height: 48px; background-color: #A50064; border-radius: 14px; color: white; line-height: 48px; font-weight: 700; font-size: 24px; font-style: italic;">S</div>
          <p style="margin-top: 10px; font-weight: 700; letter-spacing: -0.5px; color: #111; font-size: 18px; text-transform: uppercase;">ShopOnePlay</p>
        </div>
        
        <h2 style="color: #111; font-size: 22px; font-weight: 700; text-align: center; margin-bottom: 8px; letter-spacing: -0.5px; text-transform: uppercase;">Xác thực tài khoản</h2>
        <p style="color: #666; font-size: 14px; text-align: center; margin-bottom: 30px; font-weight: 500;">Sử Dụng Mã Dưới Đây Để Xác Thực Email Của Bạn</p>
        
        <div style="background: #f8f9fa; border-radius: 20px; padding: 32px; text-align: center; border: 1px solid #eef0f2; margin-bottom: 30px;">
          <span style="display: block; color: #999; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 12px;">Mã xác thực email</span>
          <div style="font-size: 42px; font-weight: 700; letter-spacing: 12px; color: #A50064; font-family: 'Courier New', Courier, monospace; margin-left: 12px;">
            ${code}
          </div>
        </div>
        
        <div style="background: #fff8f8; border-radius: 12px; padding: 15px; border-left: 4px solid #ff4d4d; margin-bottom: 30px;">
          <p style="color: #d00; font-size: 12px; margin: 0; font-weight: 600;">Lưu ý: Mã Chỉ Có Hiệu Lực Trong Vòng 10P, Vui Lòng Không Chia Sẻ Mã Này Cho Ai Khác.</p>
        </div>
        
        <p style="color: #888; font-size: 12px; text-align: center; line-height: 1.6;">Nếu Bạn Không Thực Hiện Yêu Cầu. Vui Lòng Bỏ Qua Email Này.</p>
        
        <div style="margin-top: 40px; padding-top: 25px; border-top: 1px solid #eee; text-align: center;">
          <p style="color: #bbb; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; margin: 0;">© 2026 ShopOnePlay official</p>
          <p style="color: #ddd; font-size: 9px; margin-top: 5px;">Hệ Thống Cung Cấp Tài Khoản Game Số 1</p>
        </div>
      </div>
    `,
  }

  return transporter.sendMail(mailOptions)
}

export const sendPasswordResetEmail = async (email: string, code: string) => {
  const mailOptions = {
    from: `"Hỗ Trợ ShopOnePlay" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: "Mã Khôi Phục Mật Khẩu - ShopOnePlay",
    html: `
      <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 500px; margin: 40px auto; padding: 40px; background-color: #ffffff; border-radius: 24px; border: 1px solid #f0f0f0; box-shadow: 0 10px 25px rgba(0,0,0,0.03);">
        <div style="text-align: center; margin-bottom: 30px;">
          <div style="display: inline-block; width: 48px; height: 48px; background-color: #A50064; border-radius: 14px; color: white; line-height: 48px; font-weight: 700; font-size: 24px; font-style: italic;">S</div>
          <p style="margin-top: 10px; font-weight: 700; letter-spacing: -0.5px; color: #111; font-size: 18px; text-transform: uppercase;">ShopOnePlay</p>
        </div>
        
        <h2 style="color: #111; font-size: 22px; font-weight: 700; text-align: center; margin-bottom: 8px; letter-spacing: -0.5px; text-transform: uppercase;">Khôi phục mật khẩu</h2>
        <p style="color: #666; font-size: 14px; text-align: center; margin-bottom: 30px; font-weight: 500;">Sử Dụng Mã OTP Dưới Đây Để Lấy Lại Password Của Bạn</p>
        
        <div style="background: #f8f9fa; border-radius: 20px; padding: 32px; text-align: center; border: 1px solid #eef0f2; margin-bottom: 30px;">
          <span style="display: block; color: #999; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 12px;">Mã xác thực khôi phục</span>
          <div style="font-size: 42px; font-weight: 700; letter-spacing: 12px; color: #A50064; font-family: 'Courier New', Courier, monospace; margin-left: 12px;">
            ${code}
          </div>
        </div>
        
        <div style="background: #fff8f8; border-radius: 12px; padding: 15px; border-left: 4px solid #ff4d4d; margin-bottom: 30px;">
          <p style="color: #d00; font-size: 12px; margin: 0; font-weight: 600;">Lưu ý: Mã Chỉ Có Hiệu Lực Trong Vòng 10P, Vui Lòng Không Chia Sẻ Mã Này Cho Ai Khác.</p>
        </div>
        
        <p style="color: #888; font-size: 12px; text-align: center; line-height: 1.6;">Nếu Bạn Không Thực Hiện Yêu Cầu. Vui Lòng Bỏ Qua Email Này.</p>
        
        <div style="margin-top: 40px; padding-top: 25px; border-top: 1px solid #eee; text-align: center;">
          <p style="color: #bbb; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; margin: 0;">© 2026 ShopOnePlay official</p>
          <p style="color: #ddd; font-size: 9px; margin-top: 5px;">Hệ Thống Cung Cấp Tài Khoản Game Số 1</p>
        </div>
      </div>
    `,
  }

  return transporter.sendMail(mailOptions)
}
