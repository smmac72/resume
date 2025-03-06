import React, { useState, useEffect } from 'react';
import '../styles/LoadingScreen.css';

const LoadingScreen = () => {
  const [logs, setLogs] = useState([]); // Единый массив для всех логов
  const [showingLogo, setShowingLogo] = useState(true);
  const [bootComplete, setBootComplete] = useState(false);
  
  // ASCII Amogus logo
  const amogusLogo = [
    { text: "  ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣤⣤⣤⣤⣤⣶⣦⣤⣄⡀⠀⠀⠀⠀⠀⠀⠀⠀", type: "normal", delay: 50 },
    { text: "  ⠀⠀⠀⠀⠀⠀⠀⠀⢀⣴⣿⡿⠛⠉⠙⠛⠛⠛⠛⠻⢿⣿⣷⣤⡀⠀⠀⠀⠀⠀", type: "normal", delay: 50 },
    { text: "  ⠀⠀⠀⠀⠀⠀⠀⠀⣼⣿⠋⠀⠀⠀⠀⠀⠀⠀⢀⣀⣀⠈⢻⣿⣿⡄⠀⠀⠀⠀", type: "normal", delay: 50 },
    { text: "  ⠀⠀⠀⠀⠀⠀⠀⣸⣿⡏⠀⠀⠀⣠⣶⣾⣿⣿⣿⠿⠿⠿⢿⣿⣿⣿⣄⠀⠀⠀", type: "normal", delay: 50 },
    { text: "  ⠀⠀⠀⠀⠀⠀⠀⣿⣿⠁⠀⠀⢰⣿⣿⣯⠁⠀⠀⠀⠀⠀⠀⠀⠈⠙⢿⣷⡄⠀", type: "normal", delay: 50 },
    { text: "  ⠀⠀⣀⣤⣴⣶⣶⣿⡟⠀⠀⠀⢸⣿⣿⣿⣆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣷⠀", type: "normal", delay: 50 },
    { text: "  ⠀⢰⣿⡟⠋⠉⣹⣿⡇⠀⠀⠀⠘⣿⣿⣿⣿⣷⣦⣤⣤⣤⣶⣶⣶⣶⣿⣿⣿⠀", type: "normal", delay: 50 },
    { text: "  ⠀⢸⣿⡇⠀⠀⣿⣿⡇⠀⠀⠀⠀⠹⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠃⠀", type: "normal", delay: 50 },
    { text: "  ⠀⣸⣿⡇⠀⠀⣿⣿⡇⠀⠀⠀⠀⠀⠉⠻⠿⣿⣿⣿⣿⡿⠿⠿⠛⢻⣿⡇⠀⠀", type: "normal", delay: 50 },
    { text: "  ⠀⣿⣿⠁⠀⠀⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣧⠀⠀", type: "normal", delay: 50 },
    { text: "  ⠀⣿⣿⠀⠀⠀⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⠀⠀", type: "normal", delay: 50 },
    { text: "  ⠀⣿⣿⠀⠀⠀⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⠀⠀", type: "normal", delay: 50 },
    { text: "  ⠀⢿⣿⡆⠀⠀⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⡇⠀⠀", type: "normal", delay: 50 },
    { text: "  ⠀⠸⣿⣧⡀⠀⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⠃⠀⠀", type: "normal", delay: 50 },
    { text: "  ⠀⠀⠛⢿⣿⣿⣿⣿⣇⠀⠀⠀⠀⠀⣰⣿⣿⣷⣶⣶⣶⣶⠶⠀⢠⣿⣿⠀⠀⠀", type: "normal", delay: 50 },
    { text: "  ⠀⠀⠀⠀⠀⠀⠀⣿⣿⠀⠀⠀⠀⠀⣿⣿⡇⠀⣽⣿⡏⠁⠀⠀⢸⣿⡇⠀⠀⠀", type: "normal", delay: 50 },
    { text: "  ⠀⠀⠀⠀⠀⠀⠀⣿⣿⠀⠀⠀⠀⠀⣿⣿⡇⠀⢹⣿⡆⠀⠀⠀⣸⣿⠇⠀⠀⠀", type: "normal", delay: 50 },
    { text: "  ⠀⠀⠀⠀⠀⠀⠀⢿⣿⣦⣄⣀⣠⣴⣿⣿⠁⠀⠈⠻⣿⣿⣿⣿⡿⠏⠀⠀⠀⠀", type: "normal", delay: 50 },
    { text: "  ⠀⠀⠀⠀⠀⠀⠀⠈⠛⠻⠿⠿⠿⠿⠋⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀", type: "normal", delay: 50 },
    { text: "", type: "normal", delay: 300 },
    { text: "AMONG OS v1.0 - TERMINAL INTERFACE", type: "info", delay: 500 },
    { text: "Initializing system...", type: "normal", delay: 1000 },
  ];
  
  // Boot sequence logs с меньшими задержками для большей скорости
  const bootSequenceLogs = [
    { text: "[    0.000000] Linux version 5.15.0-amongos (root@build) (gcc version 11.2.0) #1 SMP PREEMPT", type: "info", delay: 10 },
    { text: "[    0.000000] Command line: BOOT_IMAGE=/boot/vmlinuz-5.15.0-amongos root=UUID=f8d4-65b3-82a6-a5c9", type: "normal", delay: 10 },
    { text: "[    0.000000] KERNEL supported cpus:", type: "normal", delay: 10 },
    { text: "[    0.000000]   Intel GenuineIntel", type: "normal", delay: 10 },
    { text: "[    0.000000]   AMD AuthenticAMD", type: "normal", delay: 10 },
    { text: "[    0.000000] x86/fpu: Supporting XSAVE feature 0x001: 'x87 floating point registers'", type: "normal", delay: 10 },
    { text: "[    0.000000] x86/fpu: Supporting XSAVE feature 0x002: 'SSE registers'", type: "normal", delay: 10 },
    { text: "[    0.000000] x86/fpu: Supporting XSAVE feature 0x004: 'AVX registers'", type: "normal", delay: 10 },
    { text: "[    0.000000] x86/fpu: xstate_offset[2]:  576, xstate_sizes[2]:  256", type: "normal", delay: 10 },
    { text: "[    0.000000] x86/fpu: Enabled xstate features 0x7, context size is 832 bytes", type: "normal", delay: 10 },
    { text: "[    0.000000] BIOS-provided physical RAM map:", type: "normal", delay: 10 },
    { text: "[    0.000000] BIOS-e820: [mem 0x0000000000000000-0x000000000009fbff] usable", type: "normal", delay: 10 },
    { text: "[    0.000000] BIOS-e820: [mem 0x000000000009fc00-0x000000000009ffff] reserved", type: "normal", delay: 10 },
    { text: "[    0.000000] BIOS-e820: [mem 0x00000000000f0000-0x00000000000fffff] reserved", type: "normal", delay: 10 },
    { text: "[    0.000000] BIOS-e820: [mem 0x0000000000100000-0x00000000bfffffff] usable", type: "normal", delay: 10 },
    { text: "[    0.000000] BIOS-e820: [mem 0x00000000fc000000-0x00000000ffffffff] reserved", type: "normal", delay: 10 },
    { text: "[    0.000000] NX (Execute Disable) protection: active", type: "normal", delay: 10 },
    { text: "[    0.000000] DMI: AmongOS Virtual Machine/Virtual Platform, BIOS 1.15.0-ami 06/01/2023", type: "normal", delay: 10 },
    { text: "[    0.000000] Hypervisor detected: KVM", type: "normal", delay: 10 },
    { text: "[    0.000000] kvm-clock: Using msrs 4b564d01 and 4b564d00", type: "normal", delay: 10 },
    { text: "[    0.000000] kvm-clock: cpu 0, msr 42001, primary cpu clock", type: "normal", delay: 10 },
    { text: "[    0.000000] kvm-clock: using sched offset of 4738765346 cycles", type: "normal", delay: 10 },
    { text: "[    0.000000] clocksource: kvm-clock: mask: 0xffffffffffffffff max_cycles: 0x1cd42e4dffb, max_idle_ns: 881590591483 ns", type: "normal", delay: 10 },
    { text: "[    0.000000] tsc: Detected 2900.000 MHz processor", type: "normal", delay: 10 },
    { text: "[    0.000989] e820: update [mem 0x00000000-0x00000fff] usable ==> reserved", type: "normal", delay: 10 },
    { text: "[    0.000991] e820: remove [mem 0x000a0000-0x000fffff] usable", type: "normal", delay: 10 },
    { text: "[    0.001000] last_pfn = 0xc0000 max_arch_pfn = 0x400000000", type: "normal", delay: 10 },
    { text: "[    0.001048] Scanning 1 areas for low memory corruption", type: "normal", delay: 10 },
    { text: "[    0.001048] Base memory trampoline at [ffff9f9780097000] 97000 size 24576", type: "normal", delay: 10 },
    { text: "[    0.001052] Using GB pages for direct mapping", type: "normal", delay: 10 },
    { text: "[    0.001054] BRK [0x28a801000, 0x28a801fff] PGTABLE", type: "normal", delay: 10 },
    { text: "[    0.001055] BRK [0x28a802000, 0x28a802fff] PGTABLE", type: "normal", delay: 10 },
    { text: "[    0.001056] BRK [0x28a803000, 0x28a803fff] PGTABLE", type: "normal", delay: 10 },
    { text: "[    0.001080] ACPI: Early table checksum verification disabled", type: "normal", delay: 10 },
    { text: "[    0.001082] ACPI: RSDP 0x00000000000F6450 000014 (v00 KVM   )", type: "normal", delay: 10 },
    { text: "[    0.001094] ACPI: RSDT 0x00000000FC00E3C0 000030 (v01 KVM    KVMRSDT  00000001 KVMR 00000001)", type: "normal", delay: 10 },
    { text: "[    0.001124] ACPI: FACP 0x00000000FC00DF00 0000F4 (v02 KVM    KVMFACP  00000001 KVMR 00000001)", type: "normal", delay: 10 },
    { text: "[    0.001321] ACPI: 2 ACPI AML tables successfully acquired and loaded", type: "normal", delay: 10 },
    { text: "[    0.001326] ACPI: Reserving FACP table memory at [mem 0xfc00df00-0xfc00dff3]", type: "normal", delay: 10 },
    { text: "[    0.001585] Zone ranges:", type: "normal", delay: 10 },
    { text: "[    0.001586]   DMA      [mem 0x0000000000001000-0x0000000000ffffff]", type: "normal", delay: 10 },
    { text: "[    0.001589]   DMA32    [mem 0x0000000001000000-0x00000000ffffffff]", type: "normal", delay: 10 },
    { text: "[    0.001590]   Normal   empty", type: "normal", delay: 10 },
    { text: "[    0.001591]   Device   empty", type: "normal", delay: 10 },
    { text: "[    0.001591] Movable zone start for each node", type: "normal", delay: 10 },
    { text: "[    0.001592] Early memory node ranges", type: "normal", delay: 10 },
    { text: "[    0.001593]   node   0: [mem 0x0000000000001000-0x000000000009efff]", type: "normal", delay: 10 },
    { text: "[    0.001594]   node   0: [mem 0x0000000000100000-0x00000000bfffffff]", type: "normal", delay: 10 },
    { text: "[    0.007290] Initializing XFRM netlink socket", type: "normal", delay: 10 },
    { text: "[    0.007290] NET: Registered protocol family 17", type: "normal", delay: 10 },
    { text: "[    0.007297] Key type dns_resolver registered", type: "normal", delay: 10 },
    { text: "[    0.007488] registered taskstats version 1", type: "normal", delay: 10 },
    { text: "[    0.007489] Loading compiled-in X.509 certificates", type: "normal", delay: 10 },
    { text: "[    0.009184] Loaded X.509 cert 'Build time autogenerated kernel key: 2d70ac2b96e6e335'", type: "normal", delay: 10 },
    { text: "[    0.009214] zswap: loaded using pool zstd/z3fold", type: "normal", delay: 10 },
    { text: "[    0.009302] Key type .fscrypt registered", type: "normal", delay: 10 },
    { text: "[    0.009302] Key type fscrypt-provisioning registered", type: "normal", delay: 10 },
    { text: "[    0.010003] Initializing network security", type: "normal", delay: 10 },
    { text: "[    0.010214] Key type ._fscrypt registered", type: "normal", delay: 10 },
    { text: "[    0.010404] Freeing unused decrypted memory: 2040K", type: "normal", delay: 10 },
    { text: "[    0.010909] Freeing unused kernel image (initmem) memory: 2656K", type: "normal", delay: 10 },
    { text: "[    0.034404] Write protecting the kernel read-only data: 30720k", type: "normal", delay: 10 },
    { text: "[    0.035604] Freeing unused kernel image (text/rodata gap) memory: 2044K", type: "normal", delay: 10 },
    { text: "[    0.036066] Freeing unused kernel image (rodata/data gap) memory: 444K", type: "normal", delay: 10 },
    { text: "[    0.053902] x86/mm: Checked W+X mappings: passed, no W+X pages found.", type: "normal", delay: 10 },
    { text: "[    0.053903] Run /init as init process", type: "normal", delay: 10 },
    { text: "Starting AmongOS v1.0...", type: "info", delay: 200 },
    { text: "Initializing kernel...", type: "normal", delay: 100 },
    { text: "Loading system modules:", type: "normal", delay: 50 },
    { text: "  module: system.core..............[OK]", type: "success", delay: 50 },
    { text: "  module: system.file..............[OK]", type: "success", delay: 50 },
    { text: "  module: system.network...........[OK]", type: "success", delay: 50 },
    { text: "  module: system.security..........[OK]", type: "success", delay: 50 },
    { text: "  module: system.interface.........[OK]", type: "success", delay: 50 },
    { text: "Mounting filesystems:", type: "normal", delay: 75 },
    { text: "  /boot.............................[OK]", type: "success", delay: 40 },
    { text: "  /system..........................[OK]", type: "success", delay: 40 },
    { text: "  /user............................[OK]", type: "success", delay: 40 },
    { text: "  /var.............................[OK]", type: "success", delay: 40 },
    { text: "  /tmp.............................[OK]", type: "success", delay: 40 },
    { text: "Checking hardware compatibility.....[OK]", type: "success", delay: 100 },
    { text: "Initializing network interfaces:", type: "normal", delay: 75 },
    { text: "  eth0............................[OK]", type: "success", delay: 50 },
    { text: "  lo..............................[OK]", type: "success", delay: 50 },
    { text: "Starting system services:", type: "normal", delay: 75 },
    { text: "  service: systemd................[OK]", type: "success", delay: 40 },
    { text: "  service: dbus...................[OK]", type: "success", delay: 40 },
    { text: "  service: networking.............[OK]", type: "success", delay: 40 },
    { text: "  service: ssh....................[OK]", type: "success", delay: 40 },
    { text: "  service: firewall...............[OK]", type: "success", delay: 40 },
    { text: "  service: terminal...............[OK]", type: "success", delay: 40 },
    { text: "Scanning for available servers........", type: "normal", delay: 150 },
    { text: "Found 3 servers on network.", type: "info", delay: 100 },
    { text: "Connecting to default server 31.31.196.1...", type: "normal", delay: 200 },
    { text: "Connection established.", type: "success", delay: 150 },
    { text: "Loading user interface...............", type: "normal", delay: 150 },
    { text: "Starting AmongOS Terminal Interface", type: "info", delay: 100 },
    { text: "System ready.", type: "success", delay: 100 },
  ];
  
  // Инициализация загрузки только один раз
  useEffect(() => {
    // Проверка, чтобы избежать дублирования
    if (logs.length > 0 || bootComplete) return;
    
    setBootComplete(true); // Предотвращаем многократную инициализацию
    
    // Запускаем процесс логирования
    const initialize = async () => {
      // Ожидаем немного перед началом
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Добавляем amogus logo сразу
      setLogs(amogusLogo);
      
      // Ждем немного, чтобы пользователь мог увидеть лого
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Переключаемся на boot logs
      setShowingLogo(false);
      
      // Очищаем лог и начинаем загрузку
      setLogs([]); // Очищаем, чтобы начать заново
      
      // Количество строк, достаточное для заполнения экрана
      // Это нужно чтобы логи начали отображаться снизу
      const numberOfLinesToFillScreen = Math.floor(window.innerHeight / 24); // примерно высота строки
      
      // Создаем начальный массив с пустыми строками
      const emptyLines = Array(numberOfLinesToFillScreen).fill({ text: "", type: "normal", delay: 0 });
      setLogs(emptyLines);
      
      // Задержка, чтобы установить пустые строки
      await new Promise(resolve => setTimeout(resolve, 50));
      
      // Последовательно добавляем boot логи, удаляя старые только когда их слишком много
      const maxLines = numberOfLinesToFillScreen + 5; // Чуть больше чем нужно для экрана
      
      for (let i = 0; i < bootSequenceLogs.length; i++) {
        setLogs(prevLogs => {
          // Если логов становится слишком много, удаляем старые
          if (prevLogs.length >= maxLines) {
            return [...prevLogs.slice(1), bootSequenceLogs[i]];
          } else {
            return [...prevLogs, bootSequenceLogs[i]];
          }
        });
        
        // Ждем перед добавлением следующего лога
        await new Promise(resolve => setTimeout(resolve, bootSequenceLogs[i].delay));
      }
    };
    
    initialize();
  }, [logs.length, bootComplete]);

  return (
    <div className="loading-screen">
      <div className="loading-content">
        {showingLogo ? (
          <div className="amogus-logo">
            {logs.map((log, index) => (
              <div key={index} className={`log-entry ${log.type}`}>
                {log.text}
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="loading-header">AmongOS v13.37 Boot Sequence</div>
            <div className="boot-logs-container">
              {logs.map((log, index) => (
                <div key={index} className={`log-entry ${log.type}`}>
                  {log.text}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LoadingScreen;