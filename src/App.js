import $ from "jquery"
import moment from "moment";
import CryptoJS from "crypto-js";
import logo from './logo.svg';
import './App.css';

function App() {
  $(function () {
    /* Update Transcation Date Time */
    function updateDatetime() {
      var timezone = $("select[name='timezone']").val();
      $("input[name='txndatetime']").val(moment().tz(timezone).format('YYYY:MM:DD-HH:mm:ss'));
    }

    $("select[name='timezone']").change(function () {
      updateDatetime();
    });

    /* Intercept Payment Form Submit to calculate Request Hash */
    $("#paymentForm").submit(function (event) {
      /* Environment URL */
      var environmentUrl = $("select[name='environment']").val();
      /* Payment Form */
      var paymentForm = $("#paymentForm");
      paymentForm.attr('action', environmentUrl);
      /* Extract Payment Form Parameters */
      var paymentParameters = paymentForm.serializeArray().filter(function (item) {
        return item.value !== "";
      }).reduce(function (obj, item) {
        obj[item.name] = item.value;
        return obj;
      }, {});
      /* Prepare Message Signature Content */
      const sharedSecret = $("input[name='sharedsecret']").val();
      var messageSignatureContent = [];
      const ignoreSignatureParameteres = ["hashExtended"];
      Object.keys(paymentParameters).filter(key => !ignoreSignatureParameteres.includes(key)).sort().forEach(function (key, index) {
        messageSignatureContent.push(paymentParameters[key]);
      });
      /* Calculate Message Signature */
      const messageSignature = CryptoJS.HmacSHA256(messageSignatureContent.join("|"), sharedSecret);
      const messageSignatureBase64 = CryptoJS.enc.Base64.stringify(messageSignature);
      /* Update Form Parameters */
      $("input[name='hashExtended']").val(messageSignatureBase64);
    });

    updateDatetime();
  });
  return (
    <div>
      <fieldset>
        <legend>IPG Connect Request Prerequisites</legend>
        <p>The following values are <u>not sent</u> to the server but rather necessary to generate the according request hash. The request hash calculation does not include parameters with empty values.</p>
        <p>
          <label for="environment">Test Environment:</label>
          <select name="environment">
            <option value="https://test.ipg-online.com/connect/gateway/processing">CI / Test</option>
            <option value="http://localhost/pg/request.php">Post to Checker / Test</option>
            <option value="http://localhost/Fiserv/request.php">XAMP / Test</option>


            <option value="https://test2.ipg-online.com/connect/gateway/processing">Test2</option>
            <option value="https://test3.ipg-online.com/connect/gateway/processing">Test3</option>
            <option value="https://www.ipg-online.com/connect/gateway/processing">Prod</option>
          </select>
        </p>
        <p>
          <label for="sharedsecret">Shared Secret:</label>
          <input type="text" name="sharedsecret" value='sharedsecret' />
        </p>
      </fieldset>
      <form id="paymentForm" method="post" action="#">
        <input type="hidden" name="hash_algorithm" value="HMACSHA256" />
        <input type="hidden" name="checkoutoption" value="combinedpage" />
        <input type="hidden" name="language" value="en_US" />
        <input type="hidden" name="hashExtended" value="" />
        <fieldset>
          <legend>IPG Connect Request Details</legend>
          <p>
            <label for="storename">Store ID:</label>
            <input type="text" name="storename" value="80004160" />
          </p>
          <p>
            <label for="full_bypass">Full ByPass:</label>
            <select name="full_bypass">
              <option value="false">false</option>
              <option value="true">true</option>
            </select>
          </p>
          <p>
            <label for="dccSkipOffer">Skip DCC Offer:</label>
            <select name="dccSkipOffer">
              <option value="false">false</option>
              <option value="true">true</option>
            </select>
          </p>
          <p>
            <label for="paymentMethod">Payment Method:</label>
            <select name="paymentMethod">
              <option value="">-</option>
              <option value="V">Visa</option>
              <option value="M">Mastercard</option>
              <option value="postfinance">Postfinance eFinance</option>
              <option value="postfinance_card">Postfinance Card</option>
            </select>
          </p>
          <p>
            <label for="timezone">Timezone:</label>
            <select name="timezone">
              <option value="Asia/Dubai">Asia/Dubai</option>
              <option value="Europe/Berlin">Europe/Berlin</option>

            </select>
          </p>
          <p>
            <label for="txndatetime">Transaction Datetime:</label>
            <input type="text" name="txndatetime" value="" readonly="readonly" />
          </p>
          <p>
            <label for="chargetotal">Transaction Type:</label>
            <select name="txntype">
              <option value="sale">Sale</option>
            </select>
          </p>
          <p>
            <label for="chargetotal">Transaction Amount:</label>
            <input type="text" name="chargetotal" value="13.00" />
          </p>
          <p>
            <label for="authenticateTransaction">Authenticate Transaction:</label>
            <select name="authenticateTransaction">
              <option value="false">false</option>
              <option value="true">true</option>
            </select>
          </p>
          <p>
            <label for="currency">Currency (see <a href="https://de.wikipedia.org/wiki/ISO_4217">ISO4217</a>):</label>
            <select name="currency">
              <option value="784">AED (784)</option>
              <option value="978">EUR (978)</option>
              <option value="985">PLN (985)</option>

              <option value="048">BHD (048)</option>
              <option value="840">USD (840)</option>
              <option value="826">GBP (826)</option>
              <option value="756">CHF (756)</option>
            </select>
          </p>
          <p>
            <label for="referencedSchemeTransactionId">Referenced Scheme Transaction Id:</label>
            <input type="text" name="referencedSchemeTransactionId" value="" />
          </p>
          <p>
            <label for="unscheduledCredentialOnFileType">Unscheduled Credential On FileType:</label>
            <select name="unscheduledCredentialOnFileType">
              <option value=""></option>
              <option value="FIRST">FIRST</option>
              <option value="CARDHOLDER_INITIATED">CARDHOLDER_INITIATED</option>
              <option value="MERCHANT_INITIATED">MERCHANT_INITIATED</option>
            </select>
          </p>
          <p>
            <label for="responseFailURL">Failure URL:</label>
            <input type="text" name="responseFailURL" size="60" value="http://localhost/response_failure.php" />
          </p>
          <p>
            <label for="responseSuccessURL">Success URL:</label>
            <input type="text" name="responseSuccessURL" size="60" value="http://localhost/response_success.jsp" />
          </p>
          <p>
            <label for="transactionNotificationURL">Server-to-Server Notifications URL:</label>
            <input type="text" name="transactionNotificationURL" size="60" value="http://localhost/notifications.php" />
          </p>
          <p>
            <fieldset><legend>Tokenization</legend>
              <p>
                <label for="assignToken">Assign Token:</label>
                <select name="assignToken">
                  <option value="false">false</option>
                  <option value="true">true</option>
                </select>
              </p>
              <p>
                <label for="hosteddataid">Hosted Data Id:</label>
                <input type="text" name="hosteddataid" size="60" value="" />
              </p>
            </fieldset>
          </p>
          <p>
            <input type="submit" id="submit" value="Submit" />
          </p>
        </fieldset>
      </form>
    </div>
  );
}

export default App;
