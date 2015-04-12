module.exports = ( function() {

  var ContactUser = function() {

    var nodemailer = require('nodemailer'),
        smtpConfig = require('../config/smtp'),
        smtpapi = require('smtpapi');

    var settings  = {
      host: smtpConfig.host,
      port: smtpConfig.port,
      requiresAuth: smtpConfig.auth,
      auth: {
        user: smtpConfig.login,
        pass: smtpConfig.pass
      }
    };

    return {
      sendEmail: function( mailSettings ) {

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

        smtpTransport.sendMail( mailOptions, function( error, res ) {

          smtpTransport.close();

          if( error ) {

            console.log( 'send' );

          }

        } );

      }

    };

  };

  return ContactUser;

} () );