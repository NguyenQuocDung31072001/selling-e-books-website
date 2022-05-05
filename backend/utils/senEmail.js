const nodemailer = require('nodemailer')

async function sendEmail(receiverEmail, subject, text, html) {
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: 'testdoan2022@gmail.com',
      pass: 'doan12022'
    }
  })

  let info = await transporter.sendMail({
    from: '"Book store" <bookstore@example.com>',
    to: 'testdoan2022@gmail.com', //receiverEmail,
    subject: subject,
    text: text,
    html: html // html body
  })
}

async function sendVerificationEmail(email, token) {
  const html = `<div style="background-color: white; padding: 1rem; margin: 0">
      <p>Xin chào <strong>${email}</strong></p>
      <p>
        Chúc mừng bạn đã hoàn thành thông tin đăng kí tài khoản tại
        <strong>Book store</strong>
      </p>
      <p>Dưới đây là thông tin tài khoản đã tạo:</p>
      <ul>
        <li>
          Tài khoản:
          <a href="${email}" style="font-weight: 600; color: blue">${email}</a>
        </li>
        <li>Mật khẩu: ***********</li>
      </ul>
      <p>
        Vui lòng hoàn thành xác thực tài khoản để tìm kiếm và mua sách bằng cách bấm
        vào link dưới đây:
      </p>
      <a style="text-decoration: none; display: flex" href="${
        'http://localhost:5000/v1/selling_e_books/auth/verify?token=' + token
      }">
        <div
          style="
            color: white;
            font-weight: 600;
            font-size: medium;
            background-color: mediumspringgreen;
            padding: 0.75rem 1rem;
            width: min-content;
            white-space: nowrap;
            font-family: sans-serif;
            border-radius: 5px;
          "
        >
          XÁC THỰC EMAIL
        </div>
      </a>
    </div>`
  await sendEmail(email, 'Xác thực email', '', html)
}
module.exports = { sendEmail, sendVerificationEmail }
