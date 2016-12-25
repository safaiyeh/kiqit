package co.kiqit.kiqit.login;

import android.content.DialogInterface;
import android.content.Intent;
import android.os.Environment;
import android.os.StrictMode;
import android.support.v7.app.AlertDialog;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.support.v7.widget.AppCompatButton;
import android.util.Patterns;
import android.view.View;
import android.widget.EditText;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;

import co.kiqit.kiqit.R;
import co.kiqit.kiqit.events.EventsActivity;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

public class LoginActivity extends AppCompatActivity {

    private EditText mEmailEditText;
    private EditText mPasswordEditText;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        File file = new File(Environment.getExternalStorageDirectory(), "login.txt");
        if (file.exists()) {
            startActivity(new Intent(this, EventsActivity.class));
        }

        setContentView(R.layout.activity_login);

        // TODO(jason): BAD. ASYNCTASK
        StrictMode.ThreadPolicy policy = new StrictMode.ThreadPolicy.Builder().permitAll().build();
        StrictMode.setThreadPolicy(policy);
        mEmailEditText = (EditText) findViewById(R.id.input_email);
        mPasswordEditText = (EditText) findViewById(R.id.input_password);
        setupSignUpButton();
        setupLoginButton();
    }

    private void setupSignUpButton() {
        AppCompatButton mSignUpButton = (AppCompatButton) findViewById(R.id.login_signup_button);
        mSignUpButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if (!isEmailValid(mEmailEditText.getText().toString().trim().toLowerCase())) {
                    showAlertDialog("Oops!", "You must use a sjsu.edu email to sign up.");
                } else {
                    try {
                        signUp();
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                }

                clearFields();
            }
        });
    }

    private void setupLoginButton() {
        AppCompatButton mLogInButton = (AppCompatButton) findViewById(R.id.login_login_button);
        mLogInButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                try {
                    login();
                } catch (JSONException e) {
                    e.printStackTrace();
                }

                clearFields();
            }
        });
    }

    private void login() throws JSONException {
        MediaType JSON = MediaType.parse("application/json; charset=utf-8");
        JSONObject jsonObject = new JSONObject()
                    .put("email", mEmailEditText.getText().toString().trim().toLowerCase())
                    .put("password", mPasswordEditText.getText().toString());


        OkHttpClient client = new OkHttpClient();
        RequestBody requestBody = RequestBody.create(JSON, jsonObject.toString());


        Request request = new Request.Builder()
                .url("https://kiqit.co/api/user/login")
                .post(requestBody)
                .build();

        Response response;
        try {
            response = client.newCall(request).execute();

            if (response.code() != 200) {
                showAlertDialog("Oops!", "Looks like you entered invalid login credentials!");
            } else {
                createLoginFile();
                startActivity(new Intent(this, EventsActivity.class));
            }

            response.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private void signUp() throws JSONException {
        MediaType JSON = MediaType.parse("application/json; charset=utf-8");
        JSONObject jsonObject = new JSONObject()
                .put("email", mEmailEditText.getText().toString().trim().toLowerCase())
                .put("password", mPasswordEditText.getText().toString());


        OkHttpClient client = new OkHttpClient();
        RequestBody requestBody = RequestBody.create(JSON, jsonObject.toString());


        Request request = new Request.Builder()
                .url("https://kiqit.co/api/user/")
                .post(requestBody)
                .build();

        Response response;
        try {
            response = client.newCall(request).execute();

            if (response.code() == 201) {
                showAlertDialog("Success!", "You have successfully created a user.");
            } else if (response.code() == 409) {
                JSONObject error = new JSONObject(response.body().string());
                try {
                    error.get("message");
                    showAlertDialog("Oops!", error.getString("message"));
                } catch (JSONException e) {
                    showAlertDialog("Oops!", "Email already exists with a user!");
                }
            }

            response.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    boolean isEmailValid(CharSequence email) {
        if (email.length() < 8) {
            return false;
        }

        if (Patterns.EMAIL_ADDRESS.matcher(email).matches()) {
            CharSequence substring = email.subSequence(email.length() - 8, email.length());
            if (substring.equals("sjsu.edu")) {
                return true;
            }
        }
        return false;
    }

    private void clearFields() {
        mPasswordEditText.setText("");
        mEmailEditText.setText("");
    }

    private void showAlertDialog(String title, String message) {
        new AlertDialog.Builder(this)
                .setTitle(title)
                .setMessage(message)
                .setPositiveButton("Ok", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialogInterface, int i) {

                    }
                })
                .show();
    }

    private void createLoginFile() {
        File root = new File(Environment.getExternalStorageDirectory(), "login.txt");
        if (!root.exists()) {
            root.mkdirs();
        }
        File filepath = new File("login.txt");  // file path to save
    }
}
