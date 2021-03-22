var wpwlOptions = {
  style: "plain",
  locale: "es",
  labels: {
    cardHolder: "Titular de la Tarjeta",
    cvv: "CVV",
    cardNumber: "Número de Tarjeta",
    expiryDate: "Expiración",
    submit: "PAGAR"
  },
  spinner: {
    lines: 17,
    length: 0,
    scale: 0.85,
    width: 13,
    color: "#9D9D9D",
    fadeColor: "#595959"
  },
  errorMessages: {
    cvvError: "CVV no válido"
  },
  onReady: function () {

    $(".wpwl-group-brand").before($(".wpwl-label-cardNumber"));
    $(".wpwl-group-cvv").after($(".wpwl-group-cardHolder").detach());

    var tipoCredito =
      '<div class="wpwl-label wpwl-label-custom">Tipo Crédito:</div>' +
      '<select id="tipoCredito" name="customParameters[SHOPPER_TIPOCREDITO]" class="wpwl-wrapper-custom-installments" style="outline: none; width: 100%;">' +
      /* '<option value="00">Corriente</option>' +
       '<option value="02">Diferido Con Intereses</option>' +
       '<option value="03">Diferido Sin Intereses</option>' +*/
      '</select>' +
      "<br>";
    '</div>';

    var diferidos =
      '<div class="wpwl-label wpwl-label-custom" style="display:inline-block;">Diferidos</div>' +
      '<div class="wpwl-wrapper wpwl-wrapper-custom" style="display:inline-block">' +
      '<select id="diferidos" name="recurring.numberOfInstallments" class="wpwl-wrapper-custom-installments" style="outline: none; width: 100%;">' +
      /* `<option value="0">Corriente | Sin Diferir</option>
       <option value="3">3 Meses Sin Intereses</option>
       <option value="6">6 Meses Sin Intereses</option>
       <option value="9">9 Meses Sin Intereses</option>
       <option value="12">12 Meses Sin Intereses</option>` +*/
      "</select>" +
      "<br><br>";
    "</div>";

    $("form.wpwl-form-card")
      .find(".wpwl-button")
      .before(tipoCredito);
    $("form.wpwl-form-card")
      .find(".wpwl-button")
      .before(diferidos);

  }
};
