'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, Clock, MapPin, Users, Trophy, DollarSign, ExternalLink, Filter, Search, Plus, Send, ChevronRight, Tag, Sparkles, Zap, Target, CheckCircle, AlertCircle, Upload, Link, MessageCircle, X } from 'lucide-react';
import { toast } from 'sonner';

const EventsPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [formData, setFormData] = useState<{ [key: string]: string }>({
    eventName: '',
    organizer: '',
    eventType: '',
    startDate: '',
    endDate: '',
    location: '',
    website: '',
    description: '',
    prizes: '',
    submitterEmail: ''
  });
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { id: 'all', name: 'All Events', icon: Sparkles },
    { id: 'hackathon', name: 'Hackathons', icon: Zap },
    { id: 'workshop', name: 'Workshops', icon: Target },
    { id: 'competition', name: 'Competitions', icon: Trophy },
    { id: 'conference', name: 'Conferences', icon: Users },
    { id: 'meetup', name: 'Meetups', icon: Calendar }
  ];

  const [events, setEvents] = useState<any[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [eventsError, setEventsError] = useState<string | null>(null);
  useEffect(() => {
    const fetchEvents = async () => {
      setEventsLoading(true);
      setEventsError(null);
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_DEV_API_URL}/event`);
        setEvents(res.data || []);
      } catch (err) {
        setEvents([]);
        setEventsError('Failed to load events. Please try again.');
      } finally {
        setEventsLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const filteredEvents = events.filter(e => {
    // Category filter
    const matchesCategory = selectedCategory === 'all' || (e.eventType && e.eventType.toLowerCase() === selectedCategory);
    // Search filter (case-insensitive, checks name, organizer, location, description, tags)
    const term = searchTerm.trim().toLowerCase();
    if (!term) return matchesCategory;
    // Only check eventName, organizer, location, eventDescription
    return matchesCategory && (
      (e.eventName && e.eventName.toLowerCase().includes(term)) ||
      (e.organizer && e.organizer.toLowerCase().includes(term)) ||
      (e.location && e.location.toLowerCase().includes(term)) ||
      (e.eventDescription && e.eventDescription.toLowerCase().includes(term))
    );
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmit = async () => {
    setIsSubmitting(true);
    const payload = {
      eventName: formData.eventName,
      organizer: formData.organizer,
      eventType: (formData.eventType)?.toLowerCase(),
      startDate: formData.startDate ? new Date(formData.startDate).toISOString() : '',
      endDate: formData.endDate ? new Date(formData.endDate).toISOString() : '',
      location: formData.location,
      eventDescription: formData.description,
      officialWebsite: formData.website,
      prizesBenefits: formData.prizes,
    };
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_DEV_API_URL}/event`, payload);
      setShowSubmitForm(false);
      toast('Your event has been submitted for review. We\'ll notify you once it\'s approved!');
    } catch (err) {
      toast('Failed to submit event. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: string, spotsLeft: number) => {
    if (status === 'registering' && spotsLeft > 0) {
      return (
        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium flex items-center gap-1">
          <CheckCircle className="w-3.5 h-3.5" />
          Open ({spotsLeft} spots)
        </span>
      );
    } else if (status === 'upcoming') {
      return (
        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
          Upcoming
        </span>
      );
    } else {
      return (
        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
          Registration Closed
        </span>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 mt-16">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-8 mb-8 text-white">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-bold mb-4">Discover Amazing Events</h2>
            <p className="text-lg text-white/90 mb-6">
              Find hackathons, workshops, competitions, and networking opportunities. 
              Level up your skills and connect with like-minded students.
            </p>
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span className="font-semibold">{events.length} Upcoming Events</span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                <span className="font-semibold">$60k+ in Prizes</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span className="font-semibold">3000+ Participants</span>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
              />
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Events Grid */}
        <div className="grid gap-6 mb-12">
          {eventsLoading ? (
            <div className="flex justify-center items-center py-16">
              <svg className="animate-spin h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
              </svg>
            </div>
          ) : eventsError ? (
            <div className="flex justify-center items-center py-16 text-red-500 font-medium">{eventsError}</div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center text-gray-500 py-16">No events found.</div>
          ) : (
            filteredEvents.map((event, idx) => {
              const formatDate = (dateStr: string) => {
                if (!dateStr) return '';
                const d = new Date(dateStr);
                if (isNaN(d.getTime())) return dateStr;
                return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
              };
              return (
                <div key={idx} className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
                  <div className="p-8">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-2xl font-bold text-gray-900">{event.eventName}</h3>
                        </div>
                        <p className="text-gray-600 mb-2">Organized by {event.organizer}</p>
                        <p className="text-gray-700 leading-relaxed">
                          {event.eventDescription}
                        </p>
                      </div>
                      {event.officialWebsite && (
                        <a
                          href={event.officialWebsite}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors ml-6"
                        >
                          Visit Website
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>

                    {/* Event Details Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                      <div className="flex items-center gap-3 text-gray-600">
                        <Calendar className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Registration Dates</p>
                          <p className="font-medium text-gray-900">
                            {formatDate(event.startDate) === formatDate(event.endDate)
                              ? formatDate(event.startDate)
                              : `${formatDate(event.startDate)} - ${formatDate(event.endDate)}`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-gray-600">
                        <MapPin className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Location</p>
                          <p className="font-medium text-gray-900">{event.location}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-gray-600">
                        <Trophy className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Prizes/Benefits</p>
                          <p className="font-medium text-gray-900">{event.prizesBenefits}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                  {['web', 'ai/ml'].map((tag, idx) => (
                    <span key={idx} className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Submit Event Section */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 mb-8">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Have an Event to Share?</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Submit your hackathon, workshop, or tech event to be featured on SkillSync. 
              All submissions are reviewed before being published.
            </p>
          </div>
          <div className="text-center">
            <button
              onClick={() => setShowSubmitForm(true)}
              className="inline-flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all hover:shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Submit an Event
            </button>
          </div>
        </div>
      </div>

      {/* Submit Event Modal */}
      {showSubmitForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Submit an Event</h2>
                  <p className="text-sm text-gray-600 mt-1">All submissions are reviewed before publishing</p>
                </div>
                <button
                  onClick={() => setShowSubmitForm(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Event Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Name *
                </label>
                <input
                  type="text"
                  name="eventName"
                  value={formData.eventName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                  placeholder="Spring Hackathon 2024"
                />
              </div>

              {/* Organizer */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Organizer/Host *
                </label>
                <input
                  type="text"
                  name="organizer"
                  value={formData.organizer}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                  placeholder="University Name or Organization"
                />
              </div>

              {/* Event Type and Dates */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Type *
                  </label>
                  <select
                    name="eventType"
                    value={formData.eventType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                  >
                    <option value="">Select type</option>
                    <option value="hackathon">Hackathon</option>
                    <option value="workshop">Workshop</option>
                    <option value="competition">Competition</option>
                    <option value="conference">Conference</option>
                    <option value="meetup">Meetup</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date *
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                  placeholder="Campus Name or Virtual"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none resize-none"
                  placeholder="Describe your event, what participants will do, and what they'll learn..."
                />
              </div>

              {/* Links */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Official Website *
                </label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                  placeholder="https://..."
                />
              </div>

              {/* Prizes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prizes/Benefits
                </label>
                <input
                  type="text"
                  name="prizes"
                  value={formData.prizes}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                  placeholder="$5000 in prizes, internship opportunities, etc."
                />
              </div>

              {/* Notice */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-amber-800">
                    <p className="font-medium mb-1">Review Process</p>
                    <p>All event submissions are reviewed within 12-24 hours. We'll notify you via email once your event is approved and published.</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => setShowSubmitForm(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-4 w-4 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Submit for Review
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsPage;