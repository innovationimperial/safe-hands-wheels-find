
import { supabase } from "@/integrations/supabase/client";
import { DealerProfile, UserProfile } from "@/types/auth";

export async function fetchUserProfile(userId: string): Promise<{
  profile: UserProfile | null;
  dealerProfile: DealerProfile | null;
}> {
  try {
    // Fetch user profile
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (profileError) {
      throw profileError;
    }

    let profile: UserProfile | null = null;
    let dealerProfile: DealerProfile | null = null;

    if (profileData) {
      // Ensure the role field exists on the profile
      profile = {
        id: profileData.id,
        username: profileData.username || '',
        full_name: profileData.full_name,
        avatar_url: profileData.avatar_url,
        role: profileData.role || 'user' // Default to 'user' if role is missing
      };
      
      // If user has dealer role, check if they're a dealer
      if (profile.role === 'dealer') {
        const { data: dealerData, error: dealerError } = await supabase
          .from('dealers')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle();
          
        if (dealerError) {
          console.error('Error fetching dealer profile:', dealerError);
        } else if (dealerData) {
          dealerProfile = {
            id: dealerData.id,
            name: dealerData.name,
            email: dealerData.email,
            phone: dealerData.phone,
            status: dealerData.status as 'Pending' | 'Approved' | 'Rejected' || 'Pending'
          };
        }
      }
    }

    return { profile, dealerProfile };
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return { profile: null, dealerProfile: null };
  }
}
