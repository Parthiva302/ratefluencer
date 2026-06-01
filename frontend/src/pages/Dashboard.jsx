import React, { useState, useEffect, useRef } from 'react';
import client from '../api/client';
import TrendsPanel from '../components/TrendsPanel';
import IdeasPanel from '../components/IdeasPanel';
import ScriptPanel from '../components/ScriptPanel';
import CaptionPanel from '../components/CaptionPanel';
import HashtagsPanel from '../components/HashtagsPanel';
import ViralityPanel from '../components/ViralityPanel';
import ProgressBar from '../components/ProgressBar';
import Toast from '../components/Toast';
import RecentlySavedWidget from '../components/RecentlySavedWidget';
import { RefreshCcw, Download, FileText, Copy, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playSound } from '../utils/sound';
import { copyToClipboard } from '../utils/copy';
import html2pdf from 'html2pdf.js';

function Dashboard() {
  const [health, setHealth] = useState(null);
  const printRef = useRef();
  
  const handleDownloadPDF = () => {
    playSound('click');
    const element = printRef.current;
    if (!element) return;
    
    showToast('Generating PDF...');
    const opt = {
      margin:       0.5,
      filename:     `RateFluencer-${selectedTrend?.replace(/\s+/g, '-') || 'Export'}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true, logging: false },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    
    html2pdf().set(opt).from(element).save().then(() => {
      showToast('PDF Downloaded successfully!');
      playSound('success');
    });
  };

  const handleDownloadTXT = () => {
    playSound('click');
    if (!script) return;
    
    const content = `RATEFLUENCER STUDIO EXPORT
Topic: ${selectedTrend}
Idea: ${selectedIdea}

--- SCRIPT ---
HOOK: ${script.hook}
CONTENT:
${script.content.map((l, i) => `${i+1}. ${l}`).join('\n')}
CTA: ${script.cta}

--- CAPTION ---
${caption}

--- HASHTAGS ---
${[...(hashtags?.high||[]), ...(hashtags?.medium||[]), ...(hashtags?.low||[])].join(' ')}

--- VIRALITY SCORE ---
${virality}/100
`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `RateFluencer-${selectedTrend?.replace(/\s+/g, '-') || 'Export'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('TXT Downloaded successfully!');
    playSound('success');
  };

  const handleCopyAll = () => {
    playSound('click');
    if (!script) return;
    
    const content = `RATEFLUENCER STUDIO EXPORT\n\n--- SCRIPT ---\nHOOK: ${script.hook}\nCONTENT:\n${script.content.map((l, i) => `${i+1}. ${l}`).join('\n')}\nCTA: ${script.cta}\n\n--- CAPTION ---\n${caption}\n\n--- HASHTAGS ---\n${[...(hashtags?.high||[]), ...(hashtags?.medium||[]), ...(hashtags?.low||[])].join(' ')}`;
    
    copyToClipboard(content);
    showToast('Copied full package to clipboard!');
  };
  
  // Step Tracking
  const [currentStep, setCurrentStep] = useState(1);
  const getStepLabel = () => {
    switch(currentStep) {
      case 1: return "Selecting Trend";
      case 2: return "Generating Ideas";
      case 3: return "Writing Script";
      case 4: return "Writing Caption";
      case 5: return "Generating Hashtags";
      case 6: return "Predicting Virality";
      default: return "";
    }
  };

  // Toast State
  const [toast, setToast] = useState(null);
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // State for all steps
  const [trends, setTrends] = useState([]);
  const [selectedTrend, setSelectedTrend] = useState('');
  
  const [ideas, setIdeas] = useState([]);
  const [selectedIdea, setSelectedIdea] = useState('');
  
  const [script, setScript] = useState(null);
  const [caption, setCaption] = useState(null);
  const [hashtags, setHashtags] = useState(null);
  const [virality, setVirality] = useState(null);
  
  // Loading states
  const [loading, setLoading] = useState({
    trends: false,
    ideas: false,
    script: false,
    caption: false,
    hashtags: false,
    virality: false,
    save: false
  });
  
  useEffect(() => {
    client.get('/health').then(res => setHealth(res.data)).catch(err => console.error("Health check failed", err));
  }, []);

  const handleFetchTrends = async () => {
    handleReset();
    setLoading(prev => ({ ...prev, trends: true }));
    try {
      const res = await client.post('/api/trends');
      setTrends(res.data.trends);
      setCurrentStep(1);
    } catch (err) {
      console.error(err);
      showToast('Failed to fetch trends', 'error');
    } finally {
      setLoading(prev => ({ ...prev, trends: false }));
    }
  };

  const handleSelectTrend = async (trend) => {
    playSound('click');
    setSelectedTrend(trend);
    setCurrentStep(2);
    setIdeas([]); setSelectedIdea(''); setScript(null); setCaption(null); setHashtags(null); setVirality(null);
    setLoading(prev => ({ ...prev, ideas: true }));
    
    try {
      const res = await client.post('/api/ideas', { trend });
      setIdeas(res.data.ideas);
    } catch (err) {
      console.error(err);
      showToast('Failed to generate ideas', 'error');
    } finally {
      setLoading(prev => ({ ...prev, ideas: false }));
    }
  };

  const handleSelectIdea = async (idea) => {
    playSound('click');
    setSelectedIdea(idea);
    setCurrentStep(3);
    setScript(null); setCaption(null); setHashtags(null); setVirality(null);
    setLoading(prev => ({ ...prev, script: true }));
    
    try {
      const res = await client.post('/api/script', { idea });
      setScript(res.data);
    } catch (err) {
      console.error(err);
      showToast('Failed to write script', 'error');
    } finally {
      setLoading(prev => ({ ...prev, script: false }));
    }
  };

  const handleGenerateCaption = async () => {
    playSound('click');
    setCurrentStep(4);
    setLoading(prev => ({ ...prev, caption: true }));
    try {
      const capRes = await client.post('/api/caption', { idea: selectedIdea, script });
      setCaption(capRes.data.caption);
    } catch (err) {
      console.error(err);
      showToast('Failed to generate caption', 'error');
    } finally {
      setLoading(prev => ({ ...prev, caption: false }));
    }
  };

  const handleGenerateHashtags = async () => {
    playSound('click');
    setCurrentStep(5);
    setLoading(prev => ({ ...prev, hashtags: true }));
    try {
      const tagRes = await client.post('/api/hashtags', { trend: selectedTrend, idea: selectedIdea });
      setHashtags(tagRes.data.hashtags);
    } catch (err) {
      console.error(err);
      showToast('Failed to generate hashtags', 'error');
    } finally {
      setLoading(prev => ({ ...prev, hashtags: false }));
    }
  };

  const handlePredictVirality = async () => {
    playSound('click');
    setCurrentStep(6);
    setLoading(prev => ({ ...prev, virality: true }));
    try {
      const allTags = [];
      if (hashtags?.high) allTags.push(...hashtags.high);
      if (hashtags?.medium) allTags.push(...hashtags.medium);
      if (hashtags?.low) allTags.push(...hashtags.low);

      const res = await client.post('/api/virality', {
        trend: selectedTrend,
        idea: selectedIdea,
        hook: script?.hook,
        hashtags: allTags
      });
      setVirality(res.data);
    } catch (err) {
      console.error(err);
      showToast('Failed to predict virality', 'error');
    } finally {
      setLoading(prev => ({ ...prev, virality: false }));
    }
  };

  const handleSave = async () => {
    setLoading(prev => ({ ...prev, save: true }));
    try {
      await client.post('/api/save', {
        trend: selectedTrend,
        idea: selectedIdea,
        script: script,
        caption: caption,
        hashtags: hashtags,
        virality_score: virality?.virality_score || 0
      });
      
      // Fire Confetti!
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#8B5CF6', '#10B981', '#F59E0B']
      });
      
      playSound('success');
      showToast('✅ Content Package Saved to Supabase!');
    } catch (err) {
      console.error(err);
      showToast('❌ Failed to save content', 'error');
    } finally {
      setLoading(prev => ({ ...prev, save: false }));
    }
  };

  const handleReset = () => {
    setCurrentStep(1);
    setTrends([]); setSelectedTrend(''); setIdeas([]); setSelectedIdea('');
    setScript(null); setCaption(null); setHashtags(null); setVirality(null);
  };

  const handleCopySuccess = () => {
    showToast('Copied to clipboard!');
  };

  // Prevent keyboard shortcuts from firing inside inputs
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if typing in an input/textarea (though we don't have many)
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
      
      // Ctrl+Shift+C to copy current content
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'c') {
        e.preventDefault();
        import('../utils/copy').then(({ copyToClipboard }) => {
          if (currentStep === 3 && script) {
            copyToClipboard(`${script.hook}\n\n${script.content.join('\n')}\n\n${script.cta}`);
          } else if (currentStep === 4 && caption) {
            copyToClipboard(caption);
          } else if (currentStep === 5 && hashtags) {
            const allTags = [...(hashtags.high||[]), ...(hashtags.medium||[]), ...(hashtags.low||[])];
            copyToClipboard(allTags.join(' '));
          }
        });
      }
      
      // Escape to reset
      if (e.key === 'Escape') {
        handleReset();
      }
      
      // Enter to go to next step
      if (e.key === 'Enter') {
        if (currentStep === 3 && script) handleGenerateCaption();
        else if (currentStep === 4 && caption) handleGenerateHashtags();
        else if (currentStep === 5 && hashtags) handlePredictVirality();
        else if (currentStep === 6 && virality) handleSave();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStep, script, caption, hashtags, virality]);

  return (
    <div className="relative">
      
      {/* Dashboard Actions */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-white">Content Studio</h2>
          <p className="text-slate-500">Create viral content step-by-step.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleReset} className="btn-secondary py-2 px-4 flex items-center gap-2">
            <RefreshCcw size={16} /> Reset
          </button>
          <button onClick={handleFetchTrends} disabled={loading.trends} className="btn-primary py-2 px-6">
            Fetch Trends
          </button>
        </div>
      </div>
      
      {/* Progress Bar */}
      {(trends.length > 0 || loading.trends) && (
        <ProgressBar currentStep={currentStep} totalSteps={6} label={getStepLabel()} />
      )}

      {/* Main Content Flow - Printable Area */}
      <div ref={printRef} className="space-y-8 bg-transparent">
        <TrendsPanel trends={trends} onSelectTrend={handleSelectTrend} loading={loading.trends} />
        
        {(selectedTrend || loading.ideas) && currentStep >= 2 && (
          <IdeasPanel ideas={ideas} onSelectIdea={handleSelectIdea} loading={loading.ideas} />
        )}
        
        {(selectedIdea || loading.script) && currentStep >= 3 && (
          <ScriptPanel 
            script={script} 
            loading={loading.script} 
            onContinue={handleGenerateCaption} 
            onCopySuccess={handleCopySuccess}
          />
        )}
        
        {(script || loading.caption) && currentStep >= 4 && (
          <CaptionPanel 
            caption={caption} 
            loading={loading.caption} 
            onContinue={handleGenerateHashtags} 
            onCopySuccess={handleCopySuccess}
          />
        )}

        {(caption || loading.hashtags) && currentStep >= 5 && (
          <HashtagsPanel 
            hashtags={hashtags} 
            loading={loading.hashtags} 
            onContinue={handlePredictVirality} 
            onCopySuccess={handleCopySuccess}
          />
        )}
        
        {(hashtags && (virality || loading.virality)) && currentStep >= 6 && (
          <ViralityPanel 
            virality={virality} 
            loading={loading.virality} 
            onSave={handleSave} 
          />
        )}
      </div>

      {/* Download Floating Actions (Visible only at step 6) */}
      {virality && !loading.virality && (
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
           <button onClick={handleDownloadPDF} className="btn-secondary flex items-center justify-center gap-2 border-primary text-primary">
             <Download size={18} /> Export Content Package
           </button>
           <button onClick={handleDownloadTXT} className="btn-secondary flex items-center justify-center gap-2 border-slate-400 dark:border-slate-500 text-slate-700 dark:text-slate-300">
             <FileText size={18} /> Download TXT
           </button>
           <button onClick={handleCopyAll} className="btn-primary flex items-center justify-center gap-2 shadow-lg shadow-primary/30">
             <Copy size={18} /> Copy All
           </button>
        </div>
      )}

      {/* Recently Saved Widget */}
      <RecentlySavedWidget />

      {/* Toast Notifications */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
      
    </div>
  );
}

export default Dashboard;
