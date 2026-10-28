import { useEffect, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import type { Zone, ZoneInput, ZoneStatus } from './src/types';
import {
  getZones,
  getZone,
  createZone,
  replaceZone,
  updateZoneStatus,
  deleteZone,
  getActiveApiUrl,
  setActiveApiUrl,
  LOCAL_API_URL,
  CLOUD_API_URL
} from './src/api';

type Tab = 'LISTADO' | 'DETALLE' | 'NUEVO' | 'EDITAR';

export default function App() {
  const [tab, setTab] = useState<Tab>('LISTADO');
  const [zones, setZones] = useState<Zone[]>([]);
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);

  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('');

  const [apiUrl, setApiUrl] = useState(getActiveApiUrl());

  const [name, setName] = useState('');
  const [capacity, setCapacity] = useState('2000');
  const [status, setStatus] = useState<ZoneStatus>('OPEN');

  function switchEnv(url: string) {
    setActiveApiUrl(url);
    setApiUrl(url);
    setFeedback('Entorno: ' + (url === LOCAL_API_URL ? 'Local (:3000)' : 'AWS Cloud'));
  }

  async function loadZones() {
    setLoading(true);
    setError('');
    try {
      const data = await getZones();
      setZones(data);
      if (selectedZone) {
        const fresh = data.find((z) => z.id === selectedZone.id);
        if (fresh) setSelectedZone(fresh);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al conectar');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadZones();
  }, [apiUrl]);

  async function openDetail(zone: Zone) {
    setSelectedZone(zone);
    setTab('DETALLE');
    setError('');
    setFeedback('');
    try {
      const fresh = await getZone(zone.id);
      setSelectedZone(fresh);
    } catch {
      // Si falla la peticion individual se mantiene el objeto de la lista
    }
  }

  function openCreate() {
    setName('');
    setCapacity('1500');
    setStatus('OPEN');
    setError('');
    setFeedback('');
    setTab('NUEVO');
  }

  function openEdit(zone: Zone) {
    setSelectedZone(zone);
    setName(zone.name);
    setCapacity(String(zone.capacity));
    setStatus(zone.status);
    setError('');
    setFeedback('');
    setTab('EDITAR');
  }

  async function handleCreate() {
    if (!name.trim()) {
      setError('El nombre no puede estar vacio');
      return;
    }
    const capNum = parseInt(capacity, 10);
    if (isNaN(capNum) || capNum <= 0) {
      setError('Capacidad invalida');
      return;
    }

    setBusy(true);
    setError('');
    try {
      const input: ZoneInput = { name: name.trim(), capacity: capNum, status };
      const created = await createZone(input);
      setFeedback('Zona creada: ' + created.name);
      await loadZones();
      setSelectedZone(created);
      setTab('DETALLE');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al crear');
    } finally {
      setBusy(false);
    }
  }

  async function handleEdit() {
    if (!selectedZone) return;
    if (!name.trim()) {
      setError('El nombre no puede estar vacio');
      return;
    }
    const capNum = parseInt(capacity, 10);
    if (isNaN(capNum) || capNum <= 0) {
      setError('Capacidad invalida');
      return;
    }

    setBusy(true);
    setError('');
    try {
      const input: ZoneInput = { name: name.trim(), capacity: capNum, status };
      const updated = await replaceZone(selectedZone.id, input);
      setFeedback('Zona actualizada: ' + updated.name);
      await loadZones();
      setSelectedZone(updated);
      setTab('DETALLE');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al actualizar');
    } finally {
      setBusy(false);
    }
  }

  async function handleToggleStatus(zone: Zone) {
    const next: ZoneStatus = zone.status === 'OPEN' ? 'FULL' : zone.status === 'FULL' ? 'CLOSED' : 'OPEN';
    setBusy(true);
    setError('');
    try {
      await updateZoneStatus(zone.id, next);
      setSelectedZone({ ...zone, status: next });
      setFeedback('Estado cambiado a ' + next);
      await loadZones();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cambiar estado');
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(zone: Zone) {
    setBusy(true);
    setError('');
    try {
      await deleteZone(zone.id);
      setSelectedZone(null);
      setFeedback('Zona eliminada');
      await loadZones();
      setTab('LISTADO');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al eliminar');
    } finally {
      setBusy(false);
    }
  }

  const statusColor = (s: ZoneStatus) => {
    if (s === 'OPEN') return '#10b981';
    if (s === 'FULL') return '#f59e0b';
    return '#ef4444';
  };

  return (
    <View style={styles.page}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.container}>
        {/* Cabecera */}
        <View style={styles.header}>
          <View style={styles.brandRow}>
            <Text style={styles.eyebrow}>VENUE CONTROL</Text>
            <View style={styles.liveBadge}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>LIVE</Text>
            </View>
          </View>
          <View style={styles.envRow}>
            <Pressable
              style={[styles.envBtn, apiUrl === LOCAL_API_URL && styles.envBtnActive]}
              onPress={() => switchEnv(LOCAL_API_URL)}
            >
              <Text style={styles.envBtnText}>Local (:3000)</Text>
            </Pressable>
            <Pressable
              style={[styles.envBtn, apiUrl === CLOUD_API_URL && styles.envBtnActive]}
              onPress={() => switchEnv(CLOUD_API_URL)}
            >
              <Text style={styles.envBtnText}>AWS Cloud</Text>
            </Pressable>
          </View>
        </View>

        {/* Pestañas de navegacion */}
        <View style={styles.tabBar}>
          {(['LISTADO', 'DETALLE', 'NUEVO', 'EDITAR'] as Tab[]).map((t) => (
            <Pressable
              key={t}
              disabled={t === 'DETALLE' && !selectedZone}
              style={[
                styles.tabBtn,
                tab === t && styles.tabBtnActive,
                t === 'DETALLE' && !selectedZone && styles.tabBtnDisabled
              ]}
              onPress={() => {
                if (t === 'NUEVO') openCreate();
                else if (t === 'EDITAR' && selectedZone) openEdit(selectedZone);
                else setTab(t);
              }}
            >
              <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>{t}</Text>
            </Pressable>
          ))}
        </View>

        {/* Mensajes de aviso */}
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        {feedback ? <Text style={styles.feedbackText}>{feedback}</Text> : null}

        {/* LISTADO */}
        {tab === 'LISTADO' && (
          <View style={styles.section}>
            <View style={styles.titleRow}>
              <View>
                <Text style={styles.subTitle}>FESTIVAL OPERATIONS</Text>
                <Text style={styles.mainTitle}>ESPACIOS</Text>
                <Text style={styles.counterText}>{zones.length} zonas · operacion en directo</Text>
              </View>
              <Pressable style={styles.refreshBtn} disabled={loading} onPress={() => void loadZones()}>
                <Text style={styles.btnTextSmall}>{loading ? 'Cargando...' : 'Recargar'}</Text>
              </Pressable>
            </View>

            <View style={styles.list}>
              {zones.map((item) => (
                <Pressable
                  key={item.id}
                  style={styles.card}
                  onPress={() => void openDetail(item)}
                >
                  <View style={styles.cardHeader}>
                    <Text style={styles.zoneName}>{item.name.toUpperCase()}</Text>
                    <View style={styles.badge}>
                      <View style={[styles.dot, { backgroundColor: statusColor(item.status) }]} />
                      <Text style={[styles.badgeText, { color: statusColor(item.status) }]}>{item.status}</Text>
                    </View>
                  </View>
                  <Text style={styles.capacityNumber}>{item.capacity.toLocaleString('es-ES')}</Text>
                  <Text style={styles.capacityLabel}>CAPACIDAD</Text>
                </Pressable>
              ))}
            </View>

            <Pressable style={styles.primaryBtn} onPress={openCreate}>
              <Text style={styles.primaryBtnText}>＋ NUEVO ESPACIO</Text>
            </Pressable>
          </View>
        )}

        {/* DETALLE */}
        {tab === 'DETALLE' && selectedZone && (
          <View style={styles.section}>
            <Text style={styles.subTitle}>DETALLE DEL ESPACIO</Text>
            <Text style={styles.mainTitle}>{selectedZone.name}</Text>
            <Text style={styles.idLabel}>ID: {selectedZone.id}</Text>

            <View style={styles.detailCard}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Aforo maximo</Text>
                <Text style={styles.detailValue}>{selectedZone.capacity.toLocaleString('es-ES')} personas</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Estado actual</Text>
                <View style={styles.badge}>
                  <View style={[styles.dot, { backgroundColor: statusColor(selectedZone.status) }]} />
                  <Text style={[styles.badgeText, { color: statusColor(selectedZone.status) }]}>
                    {selectedZone.status}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.actionsGrid}>
              <Pressable
                style={styles.actionBtn}
                disabled={busy}
                onPress={() => void handleToggleStatus(selectedZone)}
              >
                <Text style={styles.actionBtnText}>Cambiar estado (PATCH)</Text>
              </Pressable>

              <Pressable
                style={[styles.actionBtn, styles.actionBtnSecondary]}
                disabled={busy}
                onPress={() => openEdit(selectedZone)}
              >
                <Text style={styles.actionBtnText}>Editar espacio (PUT)</Text>
              </Pressable>

              <Pressable
                style={[styles.actionBtn, styles.actionBtnDanger]}
                disabled={busy}
                onPress={() => void handleDelete(selectedZone)}
              >
                <Text style={styles.actionBtnText}>Eliminar espacio (DELETE)</Text>
              </Pressable>

              <Pressable
                style={[styles.actionBtn, styles.actionBtnOutline]}
                onPress={() => setTab('LISTADO')}
              >
                <Text style={styles.outlineText}>← Volver a Espacios</Text>
              </Pressable>
            </View>
          </View>
        )}

        {/* NUEVO */}
        {tab === 'NUEVO' && (
          <View style={styles.section}>
            <Text style={styles.subTitle}>OPERACION POST /zones</Text>
            <Text style={styles.mainTitle}>Nuevo Espacio</Text>

            <View style={styles.form}>
              <Text style={styles.formLabel}>Nombre del espacio</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Ej. Carpa Club"
                placeholderTextColor="#71717a"
              />

              <Text style={styles.formLabel}>Capacidad maxima</Text>
              <TextInput
                style={styles.input}
                value={capacity}
                onChangeText={setCapacity}
                keyboardType="numeric"
                placeholder="2000"
                placeholderTextColor="#71717a"
              />

              <Text style={styles.formLabel}>Estado inicial</Text>
              <View style={styles.statusOptions}>
                {(['OPEN', 'FULL', 'CLOSED'] as ZoneStatus[]).map((s) => (
                  <Pressable
                    key={s}
                    style={[styles.statusOption, status === s && styles.statusOptionActive]}
                    onPress={() => setStatus(s)}
                  >
                    <Text style={[styles.statusOptionText, status === s && styles.statusOptionTextActive]}>
                      {s}
                    </Text>
                  </Pressable>
                ))}
              </View>

              <Pressable
                style={styles.primaryBtn}
                disabled={busy}
                onPress={() => void handleCreate()}
              >
                <Text style={styles.primaryBtnText}>{busy ? 'Guardando...' : 'Guardar Espacio (POST)'}</Text>
              </Pressable>

              <Pressable
                style={[styles.actionBtn, styles.actionBtnOutline]}
                onPress={() => setTab('LISTADO')}
              >
                <Text style={styles.outlineText}>Cancelar</Text>
              </Pressable>
            </View>
          </View>
        )}

        {/* EDITAR */}
        {tab === 'EDITAR' && selectedZone && (
          <View style={styles.section}>
            <Text style={styles.subTitle}>OPERACION PUT /zones/{selectedZone.id}</Text>
            <Text style={styles.mainTitle}>Editar Espacio</Text>

            <View style={styles.form}>
              <Text style={styles.formLabel}>Nombre del espacio</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholderTextColor="#71717a"
              />

              <Text style={styles.formLabel}>Capacidad maxima</Text>
              <TextInput
                style={styles.input}
                value={capacity}
                onChangeText={setCapacity}
                keyboardType="numeric"
                placeholderTextColor="#71717a"
              />

              <Text style={styles.formLabel}>Estado</Text>
              <View style={styles.statusOptions}>
                {(['OPEN', 'FULL', 'CLOSED'] as ZoneStatus[]).map((s) => (
                  <Pressable
                    key={s}
                    style={[styles.statusOption, status === s && styles.statusOptionActive]}
                    onPress={() => setStatus(s)}
                  >
                    <Text style={[styles.statusOptionText, status === s && styles.statusOptionTextActive]}>
                      {s}
                    </Text>
                  </Pressable>
                ))}
              </View>

              <Pressable
                style={styles.primaryBtn}
                disabled={busy}
                onPress={() => void handleEdit()}
              >
                <Text style={styles.primaryBtnText}>{busy ? 'Guardando...' : 'Reemplazar Espacio (PUT)'}</Text>
              </Pressable>

              <Pressable
                style={[styles.actionBtn, styles.actionBtnOutline]}
                onPress={() => setTab('DETALLE')}
              >
                <Text style={styles.outlineText}>Cancelar</Text>
              </Pressable>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#08090d' },
  container: { padding: 24, paddingTop: 40, gap: 16, width: '100%', maxWidth: 760, alignSelf: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  eyebrow: { color: '#ff4b9b', fontSize: 18, fontWeight: '700', letterSpacing: 2 },
  liveBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12, backgroundColor: '#1f202b' },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#10b981' },
  liveText: { color: '#ffffff', fontSize: 11, fontWeight: '700' },
  envRow: { flexDirection: 'row', gap: 6 },
  envBtn: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8, backgroundColor: '#151620', borderWidth: 1, borderColor: '#353644' },
  envBtnActive: { backgroundColor: '#cf236e', borderColor: '#cf236e' },
  envBtnText: { color: '#ffffff', fontSize: 12, fontWeight: '600' },
  tabBar: { flexDirection: 'row', backgroundColor: '#151620', borderRadius: 10, padding: 4, gap: 4, borderWidth: 1, borderColor: '#353644' },
  tabBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 6 },
  tabBtnActive: { backgroundColor: '#262738' },
  tabBtnDisabled: { opacity: 0.35 },
  tabText: { color: '#9ca3af', fontSize: 13, fontWeight: '700' },
  tabTextActive: { color: '#ffffff' },
  section: { gap: 16 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  subTitle: { color: '#ff4b9b', fontSize: 12, fontWeight: '700', letterSpacing: 1 },
  mainTitle: { color: '#ffffff', fontSize: 32, fontWeight: '800' },
  counterText: { color: '#9ca3af', fontSize: 14, marginTop: 4 },
  idLabel: { color: '#ff8fc0', fontSize: 14, fontWeight: '600' },
  refreshBtn: { paddingVertical: 8, paddingHorizontal: 14, backgroundColor: '#262738', borderRadius: 8 },
  btnTextSmall: { color: '#ffffff', fontSize: 13, fontWeight: '600' },
  list: { gap: 12 },
  card: { padding: 20, borderRadius: 14, backgroundColor: '#151620', borderWidth: 1, borderColor: '#353644' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  zoneName: { color: '#ffffff', fontSize: 20, fontWeight: '700' },
  capacityNumber: { color: '#ffffff', fontSize: 28, fontWeight: '800' },
  capacityLabel: { color: '#9ca3af', fontSize: 11, fontWeight: '700', letterSpacing: 1 },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 4, paddingHorizontal: 10, borderRadius: 12, backgroundColor: '#08090d' },
  dot: { width: 8, height: 8, borderRadius: 4 },
  badgeText: { fontSize: 12, fontWeight: '700' },
  primaryBtn: { padding: 14, backgroundColor: '#cf236e', borderRadius: 10, alignItems: 'center' },
  primaryBtnText: { color: '#ffffff', fontSize: 15, fontWeight: '700' },
  detailCard: { padding: 18, borderRadius: 12, backgroundColor: '#151620', gap: 12, borderWidth: 1, borderColor: '#353644' },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  detailLabel: { color: '#9ca3af', fontSize: 14 },
  detailValue: { color: '#ffffff', fontSize: 15, fontWeight: '600' },
  actionsGrid: { gap: 10 },
  actionBtn: { padding: 13, backgroundColor: '#262738', borderRadius: 8, alignItems: 'center' },
  actionBtnSecondary: { backgroundColor: '#3b3d56' },
  actionBtnDanger: { backgroundColor: '#7f1d1d' },
  actionBtnOutline: { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#353644' },
  actionBtnText: { color: '#ffffff', fontSize: 14, fontWeight: '600' },
  outlineText: { color: '#9ca3af', fontSize: 14, fontWeight: '600' },
  form: { gap: 12, backgroundColor: '#151620', padding: 20, borderRadius: 14, borderWidth: 1, borderColor: '#353644' },
  formLabel: { color: '#ffffff', fontSize: 14, fontWeight: '600' },
  input: { backgroundColor: '#08090d', borderWidth: 1, borderColor: '#353644', borderRadius: 8, padding: 12, color: '#ffffff', fontSize: 15 },
  statusOptions: { flexDirection: 'row', gap: 8 },
  statusOption: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 8, backgroundColor: '#08090d', borderWidth: 1, borderColor: '#353644' },
  statusOptionActive: { backgroundColor: '#cf236e', borderColor: '#cf236e' },
  statusOptionText: { color: '#9ca3af', fontSize: 13, fontWeight: '700' },
  statusOptionTextActive: { color: '#ffffff' },
  errorText: { color: '#ef4444', backgroundColor: '#3a1313', padding: 10, borderRadius: 8, fontSize: 14 },
  feedbackText: { color: '#10b981', backgroundColor: '#0d2818', padding: 10, borderRadius: 8, fontSize: 14 }
});
