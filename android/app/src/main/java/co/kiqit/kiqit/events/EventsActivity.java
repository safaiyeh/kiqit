package co.kiqit.kiqit.events;

import android.content.Intent;
import android.os.Environment;
import android.support.v4.widget.SwipeRefreshLayout;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.widget.ListView;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.File;
import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.Locale;
import java.util.SimpleTimeZone;
import java.util.TimeZone;

import co.kiqit.kiqit.R;
import co.kiqit.kiqit.login.LoginActivity;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;

public class EventsActivity extends AppCompatActivity {

    private SwipeRefreshLayout mSwipeRefreshLayout;
    private ArrayList<Event> mEventList;
    private EventsListAdapter mAdapter;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_events);
        setupSwipeRefreshLayout();
        setupEventListView();
    }

    private void setupEventListView() {
        ListView mEventsListView = (ListView) findViewById(R.id.events_list);

        try {
            getEvents();
        } catch (JSONException e) {
            e.printStackTrace();
        }

        mAdapter = new EventsListAdapter(this, mEventList);
        mEventsListView.setAdapter(mAdapter);
    }

    private void setupSwipeRefreshLayout() {
        mSwipeRefreshLayout = (SwipeRefreshLayout) findViewById(R.id.swipeContainer);
        mSwipeRefreshLayout.setColorSchemeResources(R.color.colorPrimaryDark);
        mSwipeRefreshLayout.setOnRefreshListener(new SwipeRefreshLayout.OnRefreshListener() {
            @Override
            public void onRefresh() {
                try {
                    getEvents();
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        });
    }

    private void getEvents() throws JSONException {
        OkHttpClient client = new OkHttpClient();


        Request request = new Request.Builder()
                .url("https://kiqit.co/api/events")
                .build();

        Response response;
        try {
            response = client.newCall(request).execute();
            parseJSONEventString(response.body().string());
            response.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private void parseJSONEventString(String json) {
        mEventList = new ArrayList<>();
        try {
            JSONArray jsonArray = new JSONArray(json);
            for (int i = 0; i < jsonArray.length(); i++) {
                JSONObject jsonObject = jsonArray.getJSONObject(i);

                SimpleDateFormat dateformat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss");
                dateformat.setTimeZone(TimeZone.getTimeZone("UTC"));
                Date startDate = dateformat.parse(jsonObject.getString("start_time"));
                Date endDate = dateformat.parse(jsonObject.getString("end_time"));

                SimpleDateFormat formatter = new SimpleDateFormat("EEE, MMM d - h:mm a");
                dateformat.setTimeZone(Calendar.getInstance().getTimeZone());
                String startString = formatter.format(startDate);
                String endString = formatter.format(endDate);


                Event event = new Event(jsonObject.getString("title"), jsonObject.getString("location"), startString, endString);
                mEventList.add(event);
            }

            if (mAdapter != null) {
                mAdapter.notifyDataSetChanged();
            }
            mSwipeRefreshLayout.setRefreshing(false);

        } catch (JSONException | ParseException e) {
            e.printStackTrace();
        }
    }

    private void logout() {
        File file = new File(Environment.getExternalStorageDirectory(), "login.txt");
        if (file.exists()) {
            file.delete();
        }

        startActivity(new Intent(this, LoginActivity.class));
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()) {
            case R.id.log_out:
                logout();
            default:
                return super.onOptionsItemSelected(item);
        }
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        MenuInflater inflater = getMenuInflater();
        inflater.inflate(R.menu.menu_event_list, menu);
        return true;
    }
}
