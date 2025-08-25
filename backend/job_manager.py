import json
import os
from datetime import datetime
from typing import Dict, List, Optional, Any
import threading

class JobManager:
    """
    Manages processing jobs with persistent storage and thread-safe operations
    """
    
    def __init__(self, storage_file: str = "jobs.json"):
        self.storage_file = storage_file
        self.jobs: Dict[str, Dict[str, Any]] = {}
        self.lock = threading.Lock()
        self._load_jobs()
    
    def _load_jobs(self):
        """Load jobs from persistent storage"""
        try:
            if os.path.exists(self.storage_file):
                with open(self.storage_file, "r") as f:
                    self.jobs = json.load(f)
        except Exception as e:
            print(f"Warning: Could not load jobs from {self.storage_file}: {e}")
            self.jobs = {}
    
    def _save_jobs(self):
        """Save jobs to persistent storage"""
        try:
            with open(self.storage_file, "w") as f:
                json.dump(self.jobs, f, indent=2, default=str)
        except Exception as e:
            print(f"Warning: Could not save jobs to {self.storage_file}: {e}")
    
    def create_job(self, job_id: str, job_data: Dict[str, Any]) -> bool:
        """Create a new job"""
        with self.lock:
            if job_id in self.jobs:
                return False
            
            job_data["updated_at"] = datetime.now().isoformat()
            self.jobs[job_id] = job_data
            self._save_jobs()
            return True
    
    def get_job(self, job_id: str) -> Optional[Dict[str, Any]]:
        """Get job by ID"""
        with self.lock:
            return self.jobs.get(job_id)
    
    def update_job(self, job_id: str, updates: Dict[str, Any]) -> bool:
        """Update job with new data"""
        with self.lock:
            if job_id not in self.jobs:
                return False
            
            updates["updated_at"] = datetime.now().isoformat()
            self.jobs[job_id].update(updates)
            self._save_jobs()
            return True
    
    def delete_job(self, job_id: str) -> bool:
        """Delete a job"""
        with self.lock:
            if job_id not in self.jobs:
                return False
            
            del self.jobs[job_id]
            self._save_jobs()
            return True
    
    def list_jobs(self, limit: int = 50, status: str = None) -> List[Dict[str, Any]]:
        """List jobs with optional filtering"""
        with self.lock:
            jobs_list = list(self.jobs.values())
            
            # Filter by status if specified
            if status:
                jobs_list = [job for job in jobs_list if job.get("status") == status]
            
            # Sort by creation time (newest first)
            jobs_list.sort(key=lambda x: x.get("created_at", ""), reverse=True)
            
            # Apply limit
            return jobs_list[:limit]
    
    def get_job_stats(self) -> Dict[str, int]:
        """Get job statistics"""
        with self.lock:
            stats = {
                "total": len(self.jobs),
                "processing": 0,
                "completed": 0,
                "failed": 0
            }
            
            for job in self.jobs.values():
                status = job.get("status", "unknown")
                if status in stats:
                    stats[status] += 1
            
            return stats
    
    def cleanup_old_jobs(self, days: int = 30):
        """Clean up jobs older than specified days"""
        from datetime import datetime, timedelta
        
        cutoff_date = datetime.now() - timedelta(days=days)
        
        with self.lock:
            jobs_to_delete = []
            
            for job_id, job in self.jobs.items():
                try:
                    created_at = datetime.fromisoformat(job.get("created_at", ""))
                    if created_at < cutoff_date:
                        jobs_to_delete.append(job_id)
                except:
                    # If we can't parse the date, consider it old
                    jobs_to_delete.append(job_id)
            
            # Delete old jobs
            for job_id in jobs_to_delete:
                job = self.jobs.get(job_id)
                if job:
                    # Clean up associated files
                    for file_path in [job.get("file_path"), job.get("processed_file_path")]:
                        if file_path and os.path.exists(file_path):
                            try:
                                os.remove(file_path)
                            except:
                                pass
                
                del self.jobs[job_id]
            
            if jobs_to_delete:
                self._save_jobs()
            
            return len(jobs_to_delete)
