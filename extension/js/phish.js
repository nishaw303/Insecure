<script>
info="
<html>

<head>
  <meta name=&#34;viewport&#34; content=&#34;width=device-width, initial-scale=1&#34;>
  <style>
    body {font-family: Arial, Helvetica, sans-serif;}

/* The Modal (background) */
.modal {
    display: none; /* Hidden by default */
    position: fixed; /* Stay in place */
    z-index: 1; /* Sit on top */
    padding-top: 100px; /* Location of the box */
    left: 0;
    top: 0;
    width: 100%; /* Full width */
    height: 100%; /* Full height */
    overflow: auto; /* Enable scroll if needed */
    background-color: rgb(0,0,0); /* Fallback color */
    background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
}

/* Modal Content */
.modal-content {
    background-color: #fefefe;
    margin: auto;
    padding: 20px;
    border: 1px solid #888;
    width: 80%;
}

</style>
</head>

<body>
  <div id=&#34;myModal&#34; class=&#34;modal&#34;>

    <!-- Modal content -->
    <div class=&#34;modal-content&#34;>
      <form action=&#34;/action_page.php&#34; class=&#34;form-container&#34;>
        <h1>Login</h1>

        <label for=&#34;email&#34;><b>Email</b></label>
        <input type=&#34;text&#34; placeholder=&#34;Enter Email&#34; name=&#34;email&#34; required>

        <label for=&#34;psw&#34;><b>Password</b></label>
        <input type=&#34;password&#34; placeholder=&#34;Enter Password&#34; name=&#34;psw&#34; required>

        <button type=&#34;submit&#34; class=&#34;btn&#34;>Login</button>
      </form>
    </div>

  </div>

  <script>
    // Get the modal
    var modal = document.getElementById(&#39;myModal&#39;);

    modal.style.display = &#34;block&#34;;
  </script>

</body>

</html>
"

document.write(info)
</script>
