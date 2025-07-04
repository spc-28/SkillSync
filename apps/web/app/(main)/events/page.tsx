'use client'
import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Users, Trophy, DollarSign, ExternalLink, Filter, Search, Plus, Send, ChevronRight, Tag, Sparkles, Zap, Target, CheckCircle, AlertCircle, Upload, Link, MessageCircle, X } from 'lucide-react';

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
    registrationLink: '',
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

  const events = [
    {
      id: 1,
      name: "Spring Hackathon 2024",
      type: "hackathon",
      organizer: "Stanford Computing Society",
      startDate: "March 24, 2024",
      endDate: "March 26, 2024",
      location: "Stanford Engineering Quad",
      description: "48-hour hackathon focused on building solutions for social good. Open to all skill levels with mentorship available.",
      prizes: "$10,000 in total prizes",
      participants: 200,
      registrationDeadline: "March 20, 2024",
      website: "https://stanfordhack.com",
      tags: ["AI/ML", "Web Dev", "Mobile", "Social Good"],
      status: "registering",
      spotsLeft: 45
    },
    {
      id: 2,
      name: "AI/ML Workshop Series",
      type: "workshop",
      organizer: "MIT AI Lab",
      startDate: "April 2, 2024",
      endDate: "April 30, 2024",
      location: "MIT Campus + Virtual",
      description: "4-week intensive workshop series covering deep learning, computer vision, and NLP. Hands-on projects included.",
      prizes: "Certificate of Completion",
      participants: 150,
      registrationDeadline: "March 28, 2024",
      website: "https://ai.mit.edu/workshops",
      tags: ["Machine Learning", "Deep Learning", "Python"],
      status: "registering",
      spotsLeft: 30
    },
    {
      id: 3,
      name: "Global Sustainability Challenge",
      type: "competition",
      organizer: "UC Berkeley Innovation Hub",
      startDate: "April 15, 2024",
      endDate: "June 15, 2024",
      location: "Virtual - Global",
      description: "Design innovative solutions addressing climate change and sustainability. Teams of 3-5 members required.",
      prizes: "$25,000 grand prize",
      participants: 500,
      registrationDeadline: "April 10, 2024",
      website: "https://sustainability.berkeley.edu",
      tags: ["Sustainability", "Innovation", "Design Thinking"],
      status: "upcoming",
      spotsLeft: 200
    },
    {
      id: 4,
      name: "Tech Career Fair 2024",
      type: "conference",
      organizer: "Carnegie Mellon University",
      startDate: "May 5, 2024",
      endDate: "May 6, 2024",
      location: "CMU Convention Center",
      description: "Connect with 100+ top tech companies. Bring resumes and prepare for on-spot interviews.",
      prizes: "Internship & Job Opportunities",
      participants: 2000,
      registrationDeadline: "April 25, 2024",
      website: "https://cmu.edu/career-fair",
      tags: ["Networking", "Careers", "Internships"],
      status: "registering",
      spotsLeft: 500
    },
    {
      id: 5,
      name: "Mobile Dev Meetup",
      type: "meetup",
      organizer: "Student Mobile Developers",
      startDate: "March 30, 2024",
      endDate: "March 30, 2024",
      location: "Harvard Science Center",
      description: "Monthly meetup for mobile developers. This month: Flutter vs React Native debate and hands-on coding.",
      prizes: "Swag and Pizza",
      participants: 50,
      registrationDeadline: "March 28, 2024",
      website: "https://mobilemeetup.harvard.edu",
      tags: ["Mobile Dev", "Flutter", "React Native"],
      status: "registering",
      spotsLeft: 15
    }
  ];

  const filteredEvents = events.filter(e => {
    // Category filter
    const matchesCategory = selectedCategory === 'all' || e.type === selectedCategory;
    // Search filter (case-insensitive, checks name, organizer, location, description, tags)
    const term = searchTerm.trim().toLowerCase();
    if (!term) return matchesCategory;
    const inTags = e.tags && e.tags.some((tag: string) => tag.toLowerCase().includes(term));
    return matchesCategory && (
      e.name.toLowerCase().includes(term) ||
      inTags
    );
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    console.log('Submitting event for review:', formData);
    setShowSubmitForm(false);
    // Show success message
    alert('Your event has been submitted for review. We\'ll notify you once it\'s approved!');
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
          {filteredEvents.map((event) => (
            <div key={event.id} className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-2xl font-bold text-gray-900">{event.name}</h3>
                      {getStatusBadge(event.status, event.spotsLeft)}
                    </div>
                    <p className="text-gray-600 mb-2">Organized by {event.organizer}</p>
                    <p className="text-gray-700 leading-relaxed">
                      {event.description}
                    </p>
                  </div>
                  <a
                    href={event.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors ml-6"
                  >
                    Visit Website
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>

                {/* Event Details Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  <div className="flex items-center gap-3 text-gray-600">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Dates</p>
                      <p className="font-medium text-gray-900">
                        {event.startDate === event.endDate 
                          ? event.startDate 
                          : `${event.startDate} - ${event.endDate}`}
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
                      <p className="text-sm text-gray-500">Prizes</p>
                      <p className="font-medium text-gray-900">{event.prizes}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <Users className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Expected Participants</p>
                      <p className="font-medium text-gray-900">{event.participants}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Registration Deadline</p>
                      <p className="font-medium text-gray-900">{event.registrationDeadline}</p>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {event.tags.map((tag, idx) => (
                    <span key={idx} className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
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
              <div className="grid grid-cols-2 gap-4">
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Registration Link *
                  </label>
                  <input
                    type="url"
                    name="registrationLink"
                    value={formData.registrationLink}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                    placeholder="https://..."
                  />
                </div>
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

              {/* Submitter Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Email (for notifications) *
                </label>
                <input
                  type="email"
                  name="submitterEmail"
                  value={formData.submitterEmail}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                  placeholder="your@email.com"
                />
              </div>

              {/* Notice */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-amber-800">
                    <p className="font-medium mb-1">Review Process</p>
                    <p>All event submissions are reviewed within 24-48 hours. We'll notify you via email once your event is approved and published.</p>
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
                  className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Submit for Review
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