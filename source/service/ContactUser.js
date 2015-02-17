module.exports = ( function() {

  var ContactUser = function() {

    var nodemailer = require('nodemailer'),
        smtpapi = require('smtpapi');

    var settings  = {
      host: 'smtp.sendgrid.net',
      port: parseInt(587, 10),
      requiresAuth: true,
      auth: {
        user: 'webtalk',
        pass: 'mabe1234'
      }
    };

    return {
      sendEmail: function( mailSettings ) {

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

          console.log( response );

          if(error) console.log(error);

          console.log( 'Message sent: ' + response.message);

        } );

      }

    };

  };

  return ContactUser;

} () );