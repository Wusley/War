module.exports = ( function() {

  var ContactUser = function() {

    var nodemailer = require('nodemailer'),
        smtpapi = require('smtpapi');

    var settings  = {
      host: 'smtp.sendgrid.net',
      port: parseInt(587, 10),
      requiresAuth: true,
      auth: {
        user: 'wusley',
        pass: '747w747w'
      }
    };

    return {
      sendEmail: function( mailSettings, success, fail ) {

        console.log(mailSettings);

        var header = new smtpapi();

        // Define HEADERS
        header.addTo( mailSettings.to );

        var headers = { 'x-smtpapi': header.jsonString() };

        var smtpTransport = nodemailer.createTransport( settings );

        var mailOptions = {
          from: mailSettings.from,
          to: mailSettings.to,
          subject: mailSettings.subject,
          text: mailSettings.text,
          html: mailSettings.html,
          headers: headers
        };

        smtpTransport.sendMail( mailOptions, function( error, response ) {

          smtpTransport.close();

          if( !error ) {

            success();
            console.log( 'Message sent: ' + response.message );

          } else {

            fail();
            console.log( 'Status: ' + error );

          }


        } );

      }

    };

  };

  return ContactUser;

} () );