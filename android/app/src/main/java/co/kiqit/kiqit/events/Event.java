package co.kiqit.kiqit.events;

/**
 * Created by safaiyeh on 8/17/16.
 */
public class Event {

    private String title;
    private String location;
    private String startTime;
    private String endTime;

    public Event(String title, String location, String startTime, String endTime) {
        this.title = title;
        this.location = location;
        this.startTime = startTime;
        this.endTime = endTime;
    }

    public String getTitle() {
        return title;
    }

    public String getLocation() {
        return location;
    }

    public String getStartTime() {
        return startTime;
    }

    public String getEndTime() {
        return endTime;
    }
}
