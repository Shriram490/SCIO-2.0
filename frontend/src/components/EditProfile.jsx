import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { updateProfile } from "../services/authService";

const EditProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // State for form fields
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
    profileUrl: ""
  });
  
  const fileInputRef = useRef(null);

  useEffect(() => {
    // Load existing user data from local storage
    const userDataStr = localStorage.getItem("user");
    if (userDataStr) {
      try {
        const user = JSON.parse(userDataStr);
        setFormData({
          name: user.name || "",
          email: user.email || "",
          bio: user.bio || "",
          profileUrl: user.profileUrl || ""
        });
      } catch (err) {
        console.error("Error parsing user data", err);
      }
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setSuccess(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.match('image/jpeg') && !file.type.match('image/png') && !file.type.match('image/gif')) {
        alert("Please select a valid image file (PNG, JPG, JPEG)");
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData({
          ...formData,
          profileUrl: event.target.result
        });
        setSuccess(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await updateProfile({
        name: formData.name,
        email: formData.email,
        bio: formData.bio,
        profileUrl: formData.profileUrl
      });

      if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate("/");
        }, 1500);
      } else {
        alert(response.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Profile update error", error);
      alert("An error occurred while updating profile");
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : "U";
  };

  return (
    <div className="min-h-screen bg-[#FAFAFB] font-sans text-slate-900 relative">
      {/* Structural Background Lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.03] z-0">
        <div
          className="absolute top-0 left-0 w-full h-full"
          style={{
            backgroundImage:
              "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Basic Navigation Header */}
      <header className="relative z-10 h-20 border-b border-slate-200 bg-white/80 backdrop-blur-md px-8 flex items-center justify-between">
        <div className="flex items-center gap-12">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-7 h-7 bg-indigo-600 flex items-center justify-center">
              <span className="text-white font-black text-sm italic">S</span>
            </div>
            <span className="text-lg font-bold tracking-tighter text-slate-900 uppercase italic">
              SCIO_
            </span>
          </Link>
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">
            // SYSTEM.PROFILE.EDIT //
          </span>
        </div>
        <button
          onClick={() => navigate("/dashboard")}
          className="px-6 py-2.5 bg-slate-100 text-slate-600 font-bold text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all border border-slate-200"
        >
          Return Home
        </button>
      </header>

      {/* Main Form Display */}
      <main className="relative z-10 flex-1 flex flex-col items-center p-8 lg:p-16">
        <div className="w-full max-w-3xl">
          <div className="border-l-2 border-indigo-600 pl-6 mb-12">
            <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">
              Manage Profile
            </h1>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-2">
              Update your system identity and credentials
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white p-8 lg:p-12 border border-slate-200 shadow-sm relative overflow-hidden">
             {/* Tech Element Detail */}
             <div className="absolute top-0 right-0 w-16 h-16 border-l border-b border-slate-100 bg-slate-50 opacity-50 pointer-events-none" />
             <div className="absolute top-2 right-2 text-[8px] font-mono text-slate-300">UX_001</div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
               {/* Left column: Visual Identity */}
               <div className="flex flex-col items-start gap-6">
                 <div>
                   <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
                     Identity_Visual
                   </label>
                   
                   <div 
                     className="w-40 h-40 border-2 border-slate-900 p-1 relative group cursor-pointer"
                     onClick={triggerFileInput}
                   >
                     <div className="w-full h-full bg-slate-100 flex items-center justify-center relative overflow-hidden">
                       {formData.profileUrl ? (
                         <img src={formData.profileUrl} alt="Profile" className="w-full h-full object-cover" />
                       ) : (
                         <span className="text-6xl font-black text-slate-900 italic">
                           {getInitials(formData.name)}
                         </span>
                       )}
                       
                       <div className="absolute inset-0 bg-indigo-600/80 items-center justify-center hidden group-hover:flex transition-all">
                         <span className="text-white text-[10px] font-black uppercase tracking-widest text-center">
                           Upload <br/> Image
                         </span>
                       </div>
                     </div>
                   </div>
                   
                   <input 
                     type="file" 
                     ref={fileInputRef} 
                     onChange={handleFileChange} 
                     accept=".png, .jpg, .jpeg, .gif" 
                     className="hidden" 
                   />
               </div>
               </div>

               {/* Right column: Data Input */}
               <div className="md:col-span-2 space-y-6">
                 <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1.5 ml-1">
                      Full Name
                    </label>
                    <input
                      name="name"
                      type="text"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 text-sm font-bold tracking-tight focus:outline-none focus:border-indigo-600 focus:bg-white transition-all placeholder:text-slate-300"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                 </div>

                 <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1.5 ml-1">
                      Email Address
                    </label>
                    <input
                      name="email"
                      type="email"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 text-sm font-bold tracking-tight focus:outline-none focus:border-indigo-600 focus:bg-white transition-all placeholder:text-slate-300"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                 </div>
                 
                 <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1.5 ml-1">
                      Description / Bio
                    </label>
                    <textarea
                      name="bio"
                      rows="4"
                      placeholder="Enter a brief background..."
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 text-sm tracking-tight focus:outline-none focus:border-indigo-600 focus:bg-white transition-all placeholder:text-slate-300 resize-none"
                      value={formData.bio}
                      onChange={handleChange}
                    />
                 </div>

                 {success && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-emerald-50 border border-emerald-200 p-4 text-emerald-600 text-xs font-bold uppercase tracking-widest text-center"
                    >
                      Profile Update Completed. Redirecting...
                    </motion.div>
                 )}

                 <div className="pt-4 border-t border-slate-100 flex justify-end">
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-8 py-3 bg-slate-900 text-white font-black text-xs uppercase tracking-[0.2em] shadow-[4px_4px_0px_0px_rgba(79,70,229,0.3)] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] transition-all disabled:opacity-50"
                    >
                      {loading ? "Processing..." : "Save Changes"}
                    </button>
                 </div>
               </div>
             </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default EditProfile;
