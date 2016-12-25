//
//  EventListViewController.swift
//  kiqit
//
//  Created by Jason Safaiyeh on 7/26/16.
//  Copyright © 2016 Jason Safaiyeh. All rights reserved.
//

import SwiftyJSON
import Alamofire
import UIKit

class EventsTableViewController: UIViewController, UITableViewDelegate, UITableViewDataSource {
    
    @IBOutlet var eventsTableView: UITableView?
    var eventList: [Event] = []
    
    lazy var refreshControl: UIRefreshControl = {
        let refreshControl = UIRefreshControl()
        refreshControl.addTarget(self, action: #selector(EventsTableViewController.handleRefresh(_:)), for: UIControlEvents.valueChanged)
        return refreshControl
    }()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        eventsTableView!.addSubview(self.refreshControl)
        eventsTableView?.allowsSelection = false
        eventsTableView!.estimatedRowHeight = 90
        eventsTableView!.rowHeight = UITableViewAutomaticDimension
        getEvents()
    }
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return eventList.count
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cellIdentifier = "eventCell"
        let cell = tableView.dequeueReusableCell(withIdentifier: cellIdentifier, for: indexPath) as! EventTableViewCell
        cell.titleLabel!.text = eventList[(indexPath as NSIndexPath).row].title
        cell.locationLabel!.text = eventList[(indexPath as NSIndexPath).row].location
        cell.startTimeLabel!.text = "Starts: " + eventList[(indexPath as NSIndexPath).row].startTime
        cell.endTimeLabel!.text = "Ends:  " + eventList[(indexPath as NSIndexPath).row].endTime
        return cell
    }
    
    func getEvents() {
        Alamofire.request("https://kiqit.co/api/events/", method: .get, encoding: JSONEncoding.default)
            .validate(statusCode: 200..<300)
            .responseJSON { response in
                self.parseEvents(JSON(response.result.value!))
        }
    }
    
    func handleRefresh(_ refreshControl: UIRefreshControl) {
        getEvents()
    }
    
    // TODO: CLEAN UP
    func parseEvents(_ json: JSON) {
        eventList = []
        for (_, object) in json {
            let title = object["title"].string
            let description = object["description"].string
            let location = object["location"].string
            
            let dateFormatter = DateFormatter()
            dateFormatter.dateFormat = "yyyy-MM-dd'T'HH:mm:ss.000Z"
            dateFormatter.timeZone = NSTimeZone(name: "ISO") as TimeZone!
            
            let startTime = dateFormatter.date(from: object["start_time"].string!)
            let endTime = dateFormatter.date(from: object["end_time"].string!)
            
            dateFormatter.dateFormat = "EEE, MMM d - h:mm a"
            dateFormatter.timeZone = NSTimeZone.local
            let startTimeString = dateFormatter.string(from: startTime!)
            let endTimeString = dateFormatter.string(from: endTime!)
            
            eventList.append(Event(title: title!, description: description!, location: location!, startTime: startTimeString, endTime: endTimeString))
        }
        
        self.refreshControl.endRefreshing()
        self.eventsTableView?.reloadData()
    }
    
    func logOut() {
        let file = "login.txt"
        if let dir = NSSearchPathForDirectoriesInDomains(FileManager.SearchPathDirectory.documentDirectory, FileManager.SearchPathDomainMask.allDomainsMask, true).first {
            let path = URL(fileURLWithPath: dir).appendingPathComponent(file)
            do {
                try FileManager.default.removeItem(at: path)
                performSegue(withIdentifier: "logOutSegue", sender: nil)
            } catch {
                /* error handling here */
            }
        }
    }
    
    @IBAction func logOutButton(_ sender: AnyObject) {
        logOut()
    }
}
