const nodemailer = require('nodemailer')
const dotenv = require('dotenv')
async function sendEmail(receiverEmail, subject, text, html) {
  console.log('sending Email to ', receiverEmail)
  try {
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
      to: receiverEmail, //receiverEmail,
      subject: subject,
      text: text,
      html: html // html body
    })
  } catch (error) {
    console.log(error)
    throw error
  }
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
        process.env.HOST + '/auth/verify?token=' + token
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

const sendForgotEmail = async (code, email) => {
  const html = `<div style="background-color: white; padding: 1rem; margin: 0">
    <p>Xin chào <strong>${email}</strong></p>
    <p>Chúng tôi ghi nhận một yêu cầu khôi phục mật khẩu từ bạn</p>
    <p>
      Vui dòng sử dụng mã dưới đây để xác nhận yêu cầu này:
      <strong>${code}</strong>
    </p>
  </div>`
  await sendEmail(email, 'Khôi phục mật khẩu', '', html)
}

async function sendConfirmOrderEmail(email, order) {
  const itemsHtml = initOrderItemsHTML(order.books)
  const html = `<!DOCTYPE html>
<html ⚡4email data-css-strict>
  <head>
    <meta charset="utf-8" />
    <style amp4email-boilerplate>
      body {
        visibility: hidden;
      }
    </style>
    <script async src="https://cdn.ampproject.org/v0.js"></script>
    <style amp-custom>
      .es-desk-hidden {
        display: none;
        float: left;
        overflow: hidden;
        width: 0;
        max-height: 0;
        line-height: 0;
      }
      s {
        text-decoration: line-through;
      }
      body {
        width: 100%;
        font-family: arial, 'helvetica neue', helvetica, sans-serif;
      }
      table {
        border-collapse: collapse;
        border-spacing: 0px;
      }
      table td,
      html,
      body,
      .es-wrapper {
        padding: 0;
        margin: 0;
      }
      .es-content,
      .es-header,
      .es-footer {
        table-layout: fixed;
        width: 100%;
      }
      p,
      hr {
        margin: 0;
      }
      h1,
      h2,
      h3,
      h4,
      h5 {
        margin: 0;
        line-height: 120%;
        font-family: 'trebuchet ms', helvetica, sans-serif;
      }
      .es-left {
        float: left;
      }
      .es-right {
        float: right;
      }
      .es-p5 {
        padding: 5px;
      }
      .es-p5t {
        padding-top: 5px;
      }
      .es-p5b {
        padding-bottom: 5px;
      }
      .es-p5l {
        padding-left: 5px;
      }
      .es-p5r {
        padding-right: 5px;
      }
      .es-p10 {
        padding: 10px;
      }
      .es-p10t {
        padding-top: 10px;
      }
      .es-p10b {
        padding-bottom: 10px;
      }
      .es-p10l {
        padding-left: 10px;
      }
      .es-p10r {
        padding-right: 10px;
      }
      .es-p15 {
        padding: 15px;
      }
      .es-p15t {
        padding-top: 15px;
      }
      .es-p15b {
        padding-bottom: 15px;
      }
      .es-p15l {
        padding-left: 15px;
      }
      .es-p15r {
        padding-right: 15px;
      }
      .es-p20 {
        padding: 20px;
      }
      .es-p20t {
        padding-top: 20px;
      }
      .es-p20b {
        padding-bottom: 20px;
      }
      .es-p20l {
        padding-left: 20px;
      }
      .es-p20r {
        padding-right: 20px;
      }
      .es-p25 {
        padding: 25px;
      }
      .es-p25t {
        padding-top: 25px;
      }
      .es-p25b {
        padding-bottom: 25px;
      }
      .es-p25l {
        padding-left: 25px;
      }
      .es-p25r {
        padding-right: 25px;
      }
      .es-p30 {
        padding: 30px;
      }
      .es-p30t {
        padding-top: 30px;
      }
      .es-p30b {
        padding-bottom: 30px;
      }
      .es-p30l {
        padding-left: 30px;
      }
      .es-p30r {
        padding-right: 30px;
      }
      .es-p35 {
        padding: 35px;
      }
      .es-p35t {
        padding-top: 35px;
      }
      .es-p35b {
        padding-bottom: 35px;
      }
      .es-p35l {
        padding-left: 35px;
      }
      .es-p35r {
        padding-right: 35px;
      }
      .es-p40 {
        padding: 40px;
      }
      .es-p40t {
        padding-top: 40px;
      }
      .es-p40b {
        padding-bottom: 40px;
      }
      .es-p40l {
        padding-left: 40px;
      }
      .es-p40r {
        padding-right: 40px;
      }
      .es-menu td {
        border: 0;
      }
      a {
        text-decoration: underline;
      }
      p,
      ul li,
      ol li {
        font-family: arial, 'helvetica neue', helvetica, sans-serif;
        line-height: 150%;
      }
      ul li,
      ol li {
        margin-bottom: 15px;
        margin-left: 0;
      }
      .es-menu td a {
        text-decoration: none;
        display: block;
        font-family: arial, 'helvetica neue', helvetica, sans-serif;
      }
      .es-menu amp-img,
      .es-button amp-img {
        vertical-align: middle;
      }
      .es-wrapper {
        width: 100%;
        height: 100%;
      }
      .es-wrapper-color {
        background-color: #efefef;
      }
      .es-header {
        background-color: transparent;
      }
      .es-header-body {
        background-color: #fef5e4;
      }
      .es-header-body p,
      .es-header-body ul li,
      .es-header-body ol li {
        color: #999999;
        font-size: 14px;
      }
      .es-header-body a {
        color: #999999;
        font-size: 14px;
      }
      .es-content-body {
        background-color: #ffffff;
      }
      .es-content-body p,
      .es-content-body ul li,
      .es-content-body ol li {
        color: #333333;
        font-size: 14px;
      }
      .es-content-body a {
        color: #d48344;
        font-size: 14px;
      }
      .es-footer {
        background-color: transparent;
      }
      .es-footer-body {
        background-color: #fef5e4;
      }
      .es-footer-body p,
      .es-footer-body ul li,
      .es-footer-body ol li {
        color: #333333;
        font-size: 14px;
      }
      .es-footer-body a {
        color: #333333;
        font-size: 14px;
      }
      .es-infoblock,
      .es-infoblock p,
      .es-infoblock ul li,
      .es-infoblock ol li {
        line-height: 120%;
        font-size: 12px;
        color: #cccccc;
      }
      .es-infoblock a {
        font-size: 12px;
        color: #cccccc;
      }
      h1 {
        font-size: 30px;
        font-style: normal;
        font-weight: normal;
        color: #333333;
      }
      h2 {
        font-size: 28px;
        font-style: normal;
        font-weight: normal;
        color: #333333;
      }
      h3 {
        font-size: 24px;
        font-style: normal;
        font-weight: normal;
        color: #333333;
      }
      .es-header-body h1 a,
      .es-content-body h1 a,
      .es-footer-body h1 a {
        font-size: 30px;
      }
      .es-header-body h2 a,
      .es-content-body h2 a,
      .es-footer-body h2 a {
        font-size: 28px;
      }
      .es-header-body h3 a,
      .es-content-body h3 a,
      .es-footer-body h3 a {
        font-size: 24px;
      }
      a.es-button,
      button.es-button {
        border-style: solid;
        border-color: #d48344;
        border-width: 10px 20px 10px 20px;
        display: inline-block;
        background: #d48344;
        border-radius: 0px;
        font-size: 16px;
        font-family: arial, 'helvetica neue', helvetica, sans-serif;
        font-weight: normal;
        font-style: normal;
        line-height: 120%;
        color: #ffffff;
        width: auto;
        text-align: center;
      }
      .es-button-border {
        border-style: solid solid solid solid;
        border-color: #d48344 #d48344 #d48344 #d48344;
        background: #2cb543;
        border-width: 0px 0px 0px 0px;
        display: inline-block;
        border-radius: 0px;
        width: auto;
      }
      @media only screen and (max-width: 600px) {
        p,
        ul li,
        ol li,
        a {
          line-height: 150%;
        }
        h1,
        h2,
        h3,
        h1 a,
        h2 a,
        h3 a {
          line-height: 120%;
        }
        h1 {
          font-size: 30px;
          text-align: center;
        }
        h2 {
          font-size: 26px;
          text-align: center;
        }
        h3 {
          font-size: 20px;
          text-align: center;
        }
        .es-header-body h1 a,
        .es-content-body h1 a,
        .es-footer-body h1 a {
          font-size: 30px;
        }
        .es-header-body h2 a,
        .es-content-body h2 a,
        .es-footer-body h2 a {
          font-size: 26px;
        }
        .es-header-body h3 a,
        .es-content-body h3 a,
        .es-footer-body h3 a {
          font-size: 20px;
        }
        .es-header-body p,
        .es-header-body ul li,
        .es-header-body ol li,
        .es-header-body a {
          font-size: 16px;
        }
        .es-content-body p,
        .es-content-body ul li,
        .es-content-body ol li,
        .es-content-body a {
          font-size: 16px;
        }
        .es-footer-body p,
        .es-footer-body ul li,
        .es-footer-body ol li,
        .es-footer-body a {
          font-size: 16px;
        }
        .es-infoblock p,
        .es-infoblock ul li,
        .es-infoblock ol li,
        .es-infoblock a {
          font-size: 12px;
        }
        *[class='gmail-fix'] {
          display: none;
        }
        .es-m-txt-c,
        .es-m-txt-c h1,
        .es-m-txt-c h2,
        .es-m-txt-c h3 {
          text-align: center;
        }
        .es-m-txt-r,
        .es-m-txt-r h1,
        .es-m-txt-r h2,
        .es-m-txt-r h3 {
          text-align: right;
        }
        .es-m-txt-l,
        .es-m-txt-l h1,
        .es-m-txt-l h2,
        .es-m-txt-l h3 {
          text-align: left;
        }
        .es-m-txt-r amp-img {
          float: right;
        }
        .es-m-txt-c amp-img {
          margin: 0 auto;
        }
        .es-m-txt-l amp-img {
          float: left;
        }
        .es-button-border {
          display: block;
        }
        a.es-button,
        button.es-button {
          font-size: 20px;
          display: block;
          border-left-width: 0px;
          border-right-width: 0px;
        }
        .es-btn-fw {
          border-width: 10px 0px;
          text-align: center;
        }
        .es-adaptive table,
        .es-btn-fw,
        .es-btn-fw-brdr,
        .es-left,
        .es-right {
          width: 100%;
        }
        .es-content table,
        .es-header table,
        .es-footer table,
        .es-content,
        .es-footer,
        .es-header {
          width: 100%;
          max-width: 600px;
        }
        .es-adapt-td {
          display: block;
          width: 100%;
        }
        .adapt-img {
          width: 100%;
          height: auto;
        }
        td.es-m-p0 {
          padding: 0px;
        }
        td.es-m-p0r {
          padding-right: 0px;
        }
        td.es-m-p0l {
          padding-left: 0px;
        }
        td.es-m-p0t {
          padding-top: 0px;
        }
        td.es-m-p0b {
          padding-bottom: 0;
        }
        td.es-m-p20b {
          padding-bottom: 20px;
        }
        .es-mobile-hidden,
        .es-hidden {
          display: none;
        }
        tr.es-desk-hidden,
        td.es-desk-hidden,
        table.es-desk-hidden {
          width: auto;
          overflow: visible;
          float: none;
          max-height: inherit;
          line-height: inherit;
        }
        tr.es-desk-hidden {
          display: table-row;
        }
        table.es-desk-hidden {
          display: table;
        }
        td.es-desk-menu-hidden {
          display: table-cell;
        }
        .es-menu td {
          width: 1%;
        }
        table.es-table-not-adapt,
        .esd-block-html table {
          width: auto;
        }
        table.es-social {
          display: inline-block;
        }
        table.es-social td {
          display: inline-block;
        }
        .es-menu td a {
          font-size: 16px;
        }
      }
    </style>
  </head>
  <body>
    <div class="es-wrapper-color">
      <!--[if gte mso 9
        ]><v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
          <v:fill type="tile" color="#efefef"></v:fill> </v:background
      ><![endif]-->
      <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0">
        <tr>
          <td valign="top">
            <table
              class="es-content"
              cellspacing="0"
              cellpadding="0"
              align="center"
            >
              <tr>
                <td align="center">
                  <table
                    class="es-content-body"
                    width="600"
                    cellspacing="0"
                    cellpadding="0"
                    bgcolor="#ffffff"
                    align="center"
                  >
                    <tr>
                      <td class="es-p10t es-p10b es-p20r es-p20l" align="left">
                        <table width="100%" cellspacing="0" cellpadding="0">
                          <tr>
                            <td width="560" valign="top" align="center">
                              <table
                                style="
                                  border-radius: 0px;
                                  border-collapse: separate;
                                "
                                width="100%"
                                cellspacing="0"
                                cellpadding="0"
                                role="presentation"
                              >
                                <tr>
                                  <td class="es-p10t es-p15b" align="center">
                                    <h1>Cảm ơn bạn đã tin tưởng chúng tôi<br /></h1>
                                  </td>
                                </tr>
                                <tr>
                                  <td
                                    class="es-p5t es-p5b es-p40r es-p40l"
                                    align="center"
                                  >
                                    <p style="color: #333333">
                                      Bạn vui lòng kiểm tra và xác nhận đơn hàng.
                                    </p>
                                  </td>
                                </tr>
                                <tr>
                                  <td class="es-p15t es-p10b" align="center">
                                    <span
                                      class="es-button-border"
                                      style="
                                        border-radius: 5px;
                                        background: #d48344;
                                        border-style: solid;
                                        border-color: #2cb543;
                                        border-top: 0px solid #2cb543;
                                        border-bottom: 0px solid #2cb543;
                                      "
                                      ><a
                                        href="${
                                          process.env.HOST +
                                          '/order/verify?token=' +
                                          order.verifyToken
                                        }"
                                        class="es-button"
                                        target="_blank"
                                        style="
                                          font-size: 16px;
                                          border-top-width: 10px;
                                          border-bottom-width: 10px;
                                          border-radius: 5px;
                                          background: #d48344;
                                          border-color: #d48344;
                                        "
                                        >Xác nhận đơn hàng</a
                                      ></span
                                    >
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
            <table
              class="es-content"
              cellspacing="0"
              cellpadding="0"
              align="center"
            >
              <tr>
                <td align="center">
                  <table
                    class="es-content-body"
                    width="600"
                    cellspacing="0"
                    cellpadding="0"
                    bgcolor="#ffffff"
                    align="center"
                  >
                    <tr>
                      <td class="es-p20t es-p30b es-p20r es-p20l" align="left">
                        <!--[if mso]><table width="560" cellpadding="0" cellspacing="0"><tr><td width="280" valign="top"><![endif]-->
                        <table
                          class="es-left"
                          cellspacing="0"
                          cellpadding="0"
                          align="left"
                        >
                          <tr>
                            <td class="es-m-p20b" width="280" align="left">
                              <table
                                style="
                                  background-color: #fef9ef;
                                  border-color: #efefef;
                                  border-collapse: separate;
                                  border-width: 1px 0px 1px 1px;
                                  border-style: solid;
                                "
                                width="100%"
                                cellspacing="0"
                                cellpadding="0"
                                bgcolor="#fef9ef"
                                role="presentation"
                              >
                                <tr>
                                  <td
                                    class="es-p20t es-p10b es-p20r es-p20l"
                                    align="left"
                                  >
                                    <h4>THÔNG TIN:</h4>
                                  </td>
                                </tr>
                                <tr>
                                  <td
                                    class="es-p20b es-p20r es-p20l"
                                    align="left"
                                  >
                                    <table
                                      style="width: 100%"
                                      class="cke_show_border"
                                      cellspacing="1"
                                      cellpadding="1"
                                      border="0"
                                      align="left"
                                      role="presentation"
                                    >
                                      <tr>
                                        <td
                                          style="
                                            font-size: 14px;
                                            line-height: 21px;
                                          "
                                        >
                                          Đơn hàng #:
                                        </td>
                                        <td
                                          style="
                                            font-size: 14px;
                                            line-height: 21px;
                                          "
                                        >
                                          
                                        </td>
                                      </tr>
                                      <tr>
                                        <td
                                          style="
                                            font-size: 14px;
                                            line-height: 21px;
                                          "
                                        >
                                          Ngày đặt:
                                        </td>
                                        <td
                                          style="
                                            font-size: 14px;
                                            line-height: 21px;
                                          "
                                        >
                                         ${order.createdAt.toLocaleDateString()}
                                        </td>
                                      </tr>
                                      <tr>
                                        <td
                                          style="
                                            font-size: 14px;
                                            line-height: 21px;
                                          "
                                        >
                                          Tổng cộng:
                                        </td>
                                        <td
                                          style="
                                            font-size: 14px;
                                            line-height: 21px;
                                          "
                                        >
                                          ${order.total}đ
                                        </td>
                                      </tr>
                                    </table>
                                    <p style="line-height: 150%"><br /></p>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>

                        <table
                          class="es-right"
                          cellspacing="0"
                          cellpadding="0"
                          align="right"
                        >
                          <tr>
                            <td width="280" align="left">
                              <table
                                style="
                                  background-color: #fef9ef;
                                  border-collapse: separate;
                                  border-width: 1px;
                                  border-style: solid;
                                  border-color: #efefef;
                                "
                                width="100%"
                                cellspacing="0"
                                cellpadding="0"
                                bgcolor="#fef9ef"
                                role="presentation"
                              >
                                <tr>
                                  <td
                                    class="es-p20t es-p10b es-p20r es-p20l"
                                    align="left"
                                  >
                                    <h4>THÔNG TIN VẬN CHUYỂN:</h4>
                                  </td>
                                </tr>
                                <tr>
                                  <td
                                    class="es-p20b es-p20r es-p20l"
                                    align="left"
                                  >
                                    <p>${order.customer} - ${order.phone}</p>
                                    <p>${order.address.street} - ${
    order.address.ward.WardName
  }</p>
                                    <p>${
                                      order.address.district.DistrictName
                                    } - ${
    order.address.province.ProvinceName
  }</p>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                        <!--[if mso]></td></tr></table><![endif]-->
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
            <table
              class="es-content"
              cellspacing="0"
              cellpadding="0"
              align="center"
            >
              <tr>
                <td align="center">
                  <table
                    class="es-content-body"
                    width="600"
                    cellspacing="0"
                    cellpadding="0"
                    bgcolor="#ffffff"
                    align="center"
                  >
                    <tr>
                      <td class="es-p10t es-p10b es-p20r es-p20l" align="left">
                        <!--[if mso]><table width="560" cellpadding="0" cellspacing="0"><tr><td width="270" valign="top"><![endif]-->
                        <table
                          class="es-left"
                          cellspacing="0"
                          cellpadding="0"
                          align="left"
                        >
                          <tr>
                            <td
                              class="es-m-p0r es-m-p20b"
                              width="270"
                              valign="top"
                              align="center"
                            >
                              <table
                                width="100%"
                                cellspacing="0"
                                cellpadding="0"
                                role="presentation"
                              >
                                <tr>
                                  <td class="es-p20l" align="left">
                                    <h4>SẢN PHẨM</h4>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                        <table cellspacing="0" cellpadding="0" align="right">
                          <tr>
                            <td width="270" align="left">
                              <table
                                width="100%"
                                cellspacing="0"
                                cellpadding="0"
                                role="presentation"
                              >
                                <tr>
                                  <td align="left">
                                    <table
                                      style="width: 100%"
                                      class="cke_show_border"
                                      cellspacing="1"
                                      cellpadding="1"
                                      border="0"
                                      role="presentation"
                                    >
                                      <tr>
                                        <td>
                                          <span style="font-size: 13px"
                                            >TÊN</span
                                          >
                                        </td>
                                        <td
                                          style="text-align: center"
                                          width="60"
                                        >
                                          <span style="font-size: 13px"
                                            ><span style="line-height: 100%"
                                              >SL</span
                                            ></span
                                          >
                                        </td>
                                        <td
                                          style="text-align: center"
                                          width="100"
                                        >
                                          <span style="font-size: 13px"
                                            ><span style="line-height: 100%"
                                              >GIÁ</span
                                            ></span
                                          >
                                        </td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                        <!--[if mso]></td></tr></table><![endif]-->
                      </td>
                    </tr>
                    <tr>
                      <td class="es-p20r es-p20l" align="left">
                        <table width="100%" cellspacing="0" cellpadding="0">
                          <tr>
                            <td width="560" valign="top" align="center">
                              <table
                                width="100%"
                                cellspacing="0"
                                cellpadding="0"
                                role="presentation"
                              >
                                <tr>
                                  <td
                                    class="es-p10b"
                                    align="center"
                                    style="font-size: 0"
                                  >
                                    <table
                                      width="100%"
                                      cellspacing="0"
                                      cellpadding="0"
                                      border="0"
                                      role="presentation"
                                    >
                                      <tr>
                                        <td
                                          style="
                                            border-bottom: 1px solid #efefef;
                                            background: rgba(0, 0, 0, 0) none
                                              repeat scroll 0% 0%;
                                            height: 1px;
                                            width: 100%;
                                            margin: 0px;
                                          "
                                        ></td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>

                    <!--Order item-->
                    ${itemsHtml}
                    <!--Order item-->
                    <tr>
                      <td class="es-p20r es-p20l" align="left">
                        <table width="100%" cellspacing="0" cellpadding="0">
                          <tr>
                            <td width="560" valign="top" align="center">
                              <table
                                width="100%"
                                cellspacing="0"
                                cellpadding="0"
                                role="presentation"
                              >
                                <tr>
                                  <td
                                    class="es-p10b"
                                    align="center"
                                    style="font-size: 0"
                                  >
                                    <table
                                      width="100%"
                                      cellspacing="0"
                                      cellpadding="0"
                                      border="0"
                                      role="presentation"
                                    >
                                      <tr>
                                        <td
                                          style="
                                            border-bottom: 1px solid #efefef;
                                            background: rgba(0, 0, 0, 0) none
                                              repeat scroll 0% 0%;
                                            height: 1px;
                                            width: 100%;
                                            margin: 0px;
                                          "
                                        ></td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>

                    <!--Line-->
                    <tr>
                      <td class="es-p20r es-p20l" align="left">
                        <table width="100%" cellspacing="0" cellpadding="0">
                          <tr>
                            <td width="560" valign="top" align="center">
                              <table
                                width="100%"
                                cellspacing="0"
                                cellpadding="0"
                                role="presentation"
                              >
                                <tr>
                                  <td
                                    class="es-p10b"
                                    align="center"
                                    style="font-size: 0"
                                  >
                                    <table
                                      width="100%"
                                      cellspacing="0"
                                      cellpadding="0"
                                      border="0"
                                      role="presentation"
                                    >
                                      <tr>
                                        <td
                                          style="
                                            border-bottom: 1px solid #efefef;
                                            background: rgba(0, 0, 0, 0) none
                                              repeat scroll 0% 0%;
                                            height: 1px;
                                            width: 100%;
                                            margin: 0px;
                                          "
                                        ></td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>

                    <!--Footer-->
                    <tr>
                      <td class="es-p5t es-p30b es-p40r es-p20l" align="left">
                        <table width="100%" cellspacing="0" cellpadding="0">
                          <tr>
                            <td width="540" valign="top" align="center">
                              <table
                                width="100%"
                                cellspacing="0"
                                cellpadding="0"
                                role="presentation"
                              >
                                <tr>
                                  <td align="right">
                                    <table
                                      style="width: 500px"
                                      class="cke_show_border"
                                      cellspacing="1"
                                      cellpadding="1"
                                      border="0"
                                      align="right"
                                      role="presentation"
                                    >
                                      <tr>
                                        <td
                                          style="
                                            text-align: right;
                                            font-size: 18px;
                                            line-height: 27px;
                                          "
                                        >
                                          Tạm tính:
                                        </td>
                                        <td
                                          style="
                                            text-align: right;
                                            font-size: 18px;
                                            line-height: 27px;
                                          "
                                        >
                                          ${order.subTotal}đ
                                        </td>
                                      </tr>
                                      <tr>
                                        <td
                                          style="
                                            text-align: right;
                                            font-size: 18px;
                                            line-height: 27px;
                                          "
                                        >
                                          Phí vận chuyển:
                                        </td>
                                        <td
                                          style="
                                            text-align: right;
                                            font-size: 18px;
                                            line-height: 27px;
                                            color: #d48344;
                                          "
                                        >
                                          ${order.shippingCost}đ
                                        </td>
                                      </tr>
                                      <tr>
                                        <td
                                          style="
                                            text-align: right;
                                            font-size: 18px;
                                            line-height: 27px;
                                          "
                                        >
                                          Giảm giá:
                                        </td>
                                        <td
                                          style="
                                            text-align: right;
                                            font-size: 18px;
                                            line-height: 27px;
                                          "
                                        >
                                          0đ
                                        </td>
                                      </tr>
                                      <tr>
                                        <td
                                          style="
                                            text-align: right;
                                            font-size: 18px;
                                            line-height: 27px;
                                          "
                                        >
                                          <strong>Tổng cộng</strong>
                                        </td>
                                        <td
                                          style="
                                            text-align: right;
                                            font-size: 18px;
                                            line-height: 27px;
                                            color: #d48344;
                                          "
                                        >
                                          <strong>${order.total}</strong>
                                        </td>
                                      </tr>
                                    </table>
                                    <p style="line-height: 150%"><br /></p>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>
  </body>
</html>
`
  await sendEmail(email, 'Xác nhận đơn hàng', '', html)
}

const initOrderItemsHTML = books => {
  let html = ``
  books.forEach(item => {
    html += `
    <tr>
      <td class="es-p5t es-p10b es-p20r es-p20l" align="left">
        <!--[if mso]><table width="560" cellpadding="0" cellspacing="0"><tr><td width="178" valign="top"><![endif]-->
        <table
          class="es-left"
          cellspacing="0"
          cellpadding="0"
          align="left"
        >
          <tr>
            <td
              class="es-m-p0r es-m-p20b"
              width="178"
              valign="top"
              align="center"
            >
              <table
                width="100%"
                cellspacing="0"
                cellpadding="0"
                role="presentation"
              >
                <tr>
                  <td align="center" style="font-size: 0">
                    <a
                      href="https://viewstripo.email"
                      target="_blank"
                      ><img
                        src="${item.book.coverUrl}"
                        alt="${item.book.name}"
                        class="adapt-img"
                        title="${item.book.name}"
                        width="125"
                        height="106"
                        layout="responsive"
                        style="object-fit:cover;"
                      ></img
                    ></a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
        <table cellspacing="0" cellpadding="0" align="right">
          <tr>
            <td width="362" align="left">
              <table
                width="100%"
                cellspacing="0"
                cellpadding="0"
                role="presentation"
              >
                <tr>
                  <td align="left">
                    <p><br /></p>
                    <table
                      style="width: 100%"
                      class="cke_show_border"
                      cellspacing="1"
                      cellpadding="1"
                      border="0"
                      role="presentation"
                    >
                      <tr>
                        <td>
                          ${item.book.name}
                        </td>
                        <td
                          style="text-align: center"
                          width="60"
                        >
                          ${item.amount}
                        </td>
                        <td
                          style="text-align: center"
                          width="100"
                        >
                         ${item.price}
                        </td>
                      </tr>
                    </table>
                    <p><br /></p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
        <!--[if mso]></td></tr></table><![endif]-->
      </td>
    </tr>`
  })
  return html
}

module.exports = {
  sendEmail,
  sendVerificationEmail,
  sendConfirmOrderEmail,
  sendForgotEmail
}
