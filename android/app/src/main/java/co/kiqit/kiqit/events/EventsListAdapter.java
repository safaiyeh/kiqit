package co.kiqit.kiqit.events;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.TextView;

import java.util.ArrayList;

import co.kiqit.kiqit.R;

/**
 * Created by safaiyeh on 8/17/16.
 */
public class EventsListAdapter extends BaseAdapter {

    private Context mContext;
    private LayoutInflater mInflater;
    private ArrayList<Event> mDataSource;

    public EventsListAdapter(Context mContext, ArrayList<Event> events) {
        this.mContext = mContext;
        mInflater = (LayoutInflater) mContext.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
        mDataSource = events;
    }

    @Override
    public int getCount() {
        return mDataSource.size();
    }

    @Override
    public Object getItem(int position) {
        return mDataSource.get(position);
    }

    @Override
    public long getItemId(int position) {
        return position;
    }

    @Override
    public View getView(int positon, View view, ViewGroup parent) {
        View rowView = mInflater.inflate(R.layout.row_events, parent, false);

        TextView eventTitleTextView = (TextView) rowView.findViewById(R.id.event_title);
        eventTitleTextView.setText(mDataSource.get(positon).getTitle());

        TextView locationTextView = (TextView) rowView.findViewById(R.id.event_location);
        locationTextView.setText(mDataSource.get(positon).getLocation());

        TextView startTimeTextView = (TextView) rowView.findViewById(R.id.event_start_time);
        startTimeTextView.setText("Starts: " + mDataSource.get(positon).getStartTime());

        TextView endTimeTextView = (TextView) rowView.findViewById(R.id.event_end_time);
        endTimeTextView.setText("Ends:   " + mDataSource.get(positon).getEndTime());

        return rowView;
    }
}
