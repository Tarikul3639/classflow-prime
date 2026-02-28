"use client";

import React from "react";
import { Calendar, Clock, MapPin, Users, Book, Award } from "lucide-react";

export default function OverviewPage({ params }: { params: { classId: string } }) {
  return (
    <main className="bg-slate-50 p-4 space-y-4 mx-auto">
      {/* Class Description */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
        <h3 className="text-lg font-bold text-slate-900 mb-3">About This Class</h3>
        <p className="text-sm text-slate-600 leading-relaxed">
          This course covers advanced mathematical concepts including calculus, linear
          algebra, and differential equations. Students will develop strong analytical
          and problem-solving skills applicable to various fields of science and
          engineering.
        </p>
      </div>

      {/* Class Schedule */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Schedule</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Calendar className="text-primary" size={20} />
            <div>
              <p className="text-sm font-medium text-slate-900">Class Days</p>
              <p className="text-xs text-slate-500">Monday, Wednesday, Friday</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="text-primary" size={20} />
            <div>
              <p className="text-sm font-medium text-slate-900">Time</p>
              <p className="text-xs text-slate-500">10:00 AM - 11:30 AM</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="text-primary" size={20} />
            <div>
              <p className="text-sm font-medium text-slate-900">Location</p>
              <p className="text-xs text-slate-500">Room 402, Science Block</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <Users className="text-primary" size={20} />
            <span className="text-2xl font-bold text-slate-900">32</span>
          </div>
          <p className="text-xs text-slate-500">Total Students</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <Book className="text-primary" size={20} />
            <span className="text-2xl font-bold text-slate-900">12</span>
          </div>
          <p className="text-xs text-slate-500">Assignments</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <Award className="text-primary" size={20} />
            <span className="text-2xl font-bold text-slate-900">85%</span>
          </div>
          <p className="text-xs text-slate-500">Average Grade</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="text-primary" size={20} />
            <span className="text-2xl font-bold text-slate-900">24</span>
          </div>
          <p className="text-xs text-slate-500">Classes Left</p>
        </div>
      </div>
    </main>
  );
}