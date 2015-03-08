module.exports = ( function() {

  var ContactUser = function() {

    var nodemailer = require('nodemailer'),
        smtpConfig = require('../config/smtp'),
        smtpapi = require('smtpapi');

    var settings  = {
      host: 'smtp.sendgrid.net',
      port: parseInt(587, 10),
      requiresAuth: true,
      auth: {
        user: smtpConfig.login,
        pass: smtpConfig.pass
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

            console.log( 'Message sent: ' + response.message );

          } else {

            console.log( 'Status: ' + error );

          }


        } );

      }

    };

  };

  return ContactUser;

} () );