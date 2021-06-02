package com.dsobs;

import android.os.Bundle;
import android.util.Log;

import com.facebook.react.ReactActivity;

import java.util.ArrayList;

public class MainActivity extends ReactActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        //SplashScreen.show(this);  // here
        super.onCreate(savedInstanceState);

        ArrayList<String> sign = new AppSignatureHelper(this).getAppSignatures();

        Log.e("onCreate", "onCreate: " + sign.toString());
    }

    /**
     * Returns the name of the main component registered from JavaScript. This is used to schedule
     * rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "dsobs";
    }
}
