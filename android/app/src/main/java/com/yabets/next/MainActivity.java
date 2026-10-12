package com.yabets.next;

import android.os.Bundle;
import android.webkit.WebView;
import androidx.activity.OnBackPressedCallback;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        getOnBackPressedDispatcher().addCallback(this, new OnBackPressedCallback(true) {
            @Override
            public void handleOnBackPressed() {
                if (bridge != null && bridge.getWebView() != null) {
                    WebView webView = bridge.getWebView();
                    webView.evaluateJavascript(
                        "(function() { try { if (window.__handleAndroidBack) { return window.__handleAndroidBack(); } } catch(e) {} return false; })()",
                        value -> {
                            boolean handled = "\"true\"".equals(value) || "true".equals(value);
                            if (!handled) {
                                runOnUiThread(() -> {
                                    if (webView.canGoBack()) {
                                        webView.goBack();
                                    } else {
                                        moveTaskToBack(true);
                                    }
                                });
                            }
                        }
                    );
                } else {
                    moveTaskToBack(true);
                }
            }
        });
    }
}
