export const resetPasswordTemplate = (href) => `<!DOCTYPE html
    PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=320, initial-scale=1" />
    <title>Airmail Confirm</title>
    <style type="text/css">
        .logo {
            padding-top: 32px;
            height: 68px;
            width: 1072px;
            font-family: Arial;
            font-style: normal;
            font-weight: bold;
            font-size: 34px;
            line-height: 39px;
            align-items: center;
            color: #61B3FF;
            margin-left: -20px;
            text-align: start !important;
        }

        .content-container {
            width: 1072px;
            height: 342px;
            background: #FFFFFF;
        }

        .content-msg {
            width: 921px;
            height: 103px;
            font-family: Arial;
            font-style: normal;
            font-weight: bold;
            font-size: 32px;
            line-height: 39px;
            align-items: center;
            color: #000000;
            margin-left: auto;
            margin-right: auto;
            margin-bottom: 30px;
        }
    </style>
</head>

<body style="padding:0; margin:0; display:block; background:#F5F5F5; -webkit-text-size-adjust:none; text-align: -webkit-center;">
    <div
        style="width: 100%; height: 554px; margin-left: auto; margin-right: auto; margin-top: calc(50vh - 277px); background: #F5F5F5;">
        <div class='logo'>【WEBTOONZ】RESET PASSWORD</div>
        <div class='content-container' style="padding-top: 41px; ">
            <div class='content-msg'>
                <span style="padding-top: 41px; margin-top: 41px;">
                    This code will expired in 5 minutes.
                </span>
            </div>
            <div style="width: 90%; font-size: 30px; word-break: break-all; margin-left: 5%; text-align: center !important;">
                ${href}
            </div>
        </div>
    </div>
</body>

</html>`