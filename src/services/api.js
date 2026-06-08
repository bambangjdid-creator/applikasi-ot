import { 
  MOCK_MENU, MOCK_USER_ROLE, MOCK_DATA_KARYAWAN, 
  MOCK_DIVISI, MOCK_OT_HEADER, MOCK_OT_DETAIL, 
  MOCK_APPROVAL, MOCK_AUDIT_LOG 
} from '../data/mockData';

// Simulated latency for realistic testing
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const getInitialData = (key, fallback) => {
  const cached = localStorage.getItem(key);
  return cached ? JSON.parse(cached) : fallback;
};

// Initialize localStorage if empty
if (!localStorage.getItem('MOCK_MENU')) localStorage.setItem('MOCK_MENU', JSON.stringify(MOCK_MENU));
if (!localStorage.getItem('MOCK_USER_ROLE')) localStorage.setItem('MOCK_USER_ROLE', JSON.stringify(MOCK_USER_ROLE));
if (!localStorage.getItem('MOCK_DATA_KARYAWAN')) localStorage.setItem('MOCK_DATA_KARYAWAN', JSON.stringify(MOCK_DATA_KARYAWAN));
if (!localStorage.getItem('MOCK_DIVISI')) localStorage.setItem('MOCK_DIVISI', JSON.stringify(MOCK_DIVISI));
if (!localStorage.getItem('MOCK_OT_HEADER')) localStorage.setItem('MOCK_OT_HEADER', JSON.stringify(MOCK_OT_HEADER));
if (!localStorage.getItem('MOCK_OT_DETAIL')) localStorage.setItem('MOCK_OT_DETAIL', JSON.stringify(MOCK_OT_DETAIL));
if (!localStorage.getItem('MOCK_APPROVAL')) localStorage.setItem('MOCK_APPROVAL', JSON.stringify(MOCK_APPROVAL));
if (!localStorage.getItem('MOCK_AUDIT_LOG')) localStorage.setItem('MOCK_AUDIT_LOG', JSON.stringify(MOCK_AUDIT_LOG));

const getGasUrl = () => localStorage.getItem('ot_gas_web_app_url') || '';

export const api = {
  get: async (action) => {
    const gasUrl = getGasUrl();
    if (gasUrl) {
      try {
        const response = await fetch(`${gasUrl}?action=${action}`);
        const result = await response.json();
        return result.data;
      } catch (error) {
        console.error(`[GAS GET] Error fetching ${action}:`, error);
        throw error;
      }
    } else {
      // Local Mock Data Mode
      await delay(300);
      switch (action) {
        case 'getMenu': return getInitialData('MOCK_MENU', MOCK_MENU);
        case 'getUserRole': return getInitialData('MOCK_USER_ROLE', MOCK_USER_ROLE);
        case 'getDataKaryawan': return getInitialData('MOCK_DATA_KARYAWAN', MOCK_DATA_KARYAWAN);
        case 'getDivisi': return getInitialData('MOCK_DIVISI', MOCK_DIVISI);
        case 'getOtHeader': return getInitialData('MOCK_OT_HEADER', MOCK_OT_HEADER);
        case 'getOtDetail': return getInitialData('MOCK_OT_DETAIL', MOCK_OT_DETAIL);
        case 'getApproval': return getInitialData('MOCK_APPROVAL', MOCK_APPROVAL);
        case 'getAuditLog': return getInitialData('MOCK_AUDIT_LOG', MOCK_AUDIT_LOG);
        case 'getAllData': 
          return {
            menu: getInitialData('MOCK_MENU', MOCK_MENU),
            roles: getInitialData('MOCK_USER_ROLE', MOCK_USER_ROLE),
            karyawan: getInitialData('MOCK_DATA_KARYAWAN', MOCK_DATA_KARYAWAN),
            divisi: getInitialData('MOCK_DIVISI', MOCK_DIVISI),
            otHeader: getInitialData('MOCK_OT_HEADER', MOCK_OT_HEADER),
            otDetail: getInitialData('MOCK_OT_DETAIL', MOCK_OT_DETAIL),
            approval: getInitialData('MOCK_APPROVAL', MOCK_APPROVAL),
            auditLog: getInitialData('MOCK_AUDIT_LOG', MOCK_AUDIT_LOG)
          };
        default: throw new Error(`Unknown action: ${action}`);
      }
    }
  },

  post: async (action, payload) => {
    const gasUrl = getGasUrl();
    if (gasUrl) {
      try {
        const response = await fetch(gasUrl, {
          method: 'POST',
          body: JSON.stringify({ action, payload })
        });
        // GAS typically returns opaque or requires CORS handling, 
        // assuming success if no throw
        if (response.type === 'opaque' || response.type === 'cors') {
          return { success: true };
        }
        return await response.json();
      } catch (error) {
        console.error(`[GAS POST] Error on ${action}:`, error);
        throw error;
      }
    } else {
      // Local Mock Data Mode
      await delay(400);
      let list = [];
      let storageKey = '';
      
      switch (action) {
        case 'postOtHeader': 
          storageKey = 'MOCK_OT_HEADER'; break;
        case 'postOtDetail': 
          storageKey = 'MOCK_OT_DETAIL'; break;
        case 'postApproval': 
          storageKey = 'MOCK_APPROVAL'; break;
        case 'postAuditLog': 
          storageKey = 'MOCK_AUDIT_LOG'; break;
        case 'updateOtHeaderStatus': {
          list = getInitialData('MOCK_OT_HEADER', MOCK_OT_HEADER);
          const index = list.findIndex(h => h.IdForm === payload.IdForm);
          if (index > -1) {
            list[index].StatusApproval = payload.StatusApproval;
            localStorage.setItem('MOCK_OT_HEADER', JSON.stringify(list));
          }
          return { success: true };
        }
        default: throw new Error(`Unknown POST action: ${action}`);
      }

      if (storageKey) {
        list = getInitialData(storageKey, []);
        if (Array.isArray(payload)) {
          list = [...list, ...payload];
        } else {
          list.push(payload);
        }
        localStorage.setItem(storageKey, JSON.stringify(list));
      }
      return { success: true };
    }
  }
};
