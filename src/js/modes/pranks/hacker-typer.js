// Hollywood Hacker Typer Interactive Terminal Simulation

import { BaseMode } from '../base-mode.js';

export class HackerTyperMode extends BaseMode {
  constructor() {
    super({
      id: 'hacker',
      label: 'Hacker Typer',
      category: 'pranks',
      tags: ['prank', 'hacker', 'matrix', 'terminal', 'cyber', 'code']
    });

    this.lines = [];
    this.sourceCode = [
      "struct group_info init_groups = { .usage = ATOMIC_INIT(2) };",
      "struct group_info *groups_alloc(int gidsetsize) {",
      "    struct group_info *group_info;",
      "    int nblocks;",
      "    int i;",
      "    nblocks = (gidsetsize + NGROUPS_PER_BLOCK - 1) / NGROUPS_PER_BLOCK;",
      "    nblocks = nblocks ? : 1;",
      "    group_info = kmalloc(sizeof(*group_info) + nblocks*sizeof(gid_t *), GFP_USER);",
      "    if (!group_info) return NULL;",
      "    group_info->ngroups = gidsetsize;",
      "    group_info->nblocks = nblocks;",
      "    atomic_set(&group_info->usage, 1);",
      "    if (gidsetsize <= NGROUPS_SMALL)",
      "        group_info->blocks[0] = group_info->small_block;",
      "    else {",
      "        for (i = 0; i < nblocks; i++) {",
      "            gid_t *b = (void *)__get_free_page(GFP_USER);",
      "            if (!b) goto out_undo_partial_alloc;",
      "            group_info->blocks[i] = b;",
      "        }",
      "    }",
      "    return group_info;",
      "}",
      "EXPORT_SYMBOL(groups_alloc);",
      "/* BYPASSING FIREWALL AUTHENTICATION: ACCESS GRANTED */",
      "CONNECTING TO 192.168.1.1:8080 ... OK",
      "INJECTING PAYLOAD INTO KERNEL MEMORY SPACE ...",
      "OVERFLOW BUFFER VERIFIED [0x7FFFDEADBEEF] ...",
      "ROOT PRIVILEGES ESCALATED: [UID=0 GID=0]"
    ];
    this.sourceIndex = 0;
    this.autoTypeTimer = 0;
  }

  async init(engine, store) {
    super.init(engine, store);
    this.lines = [
      "INITIALIZING CYBER PROTOCOL v4.9.2 ...",
      "SYSTEM DECRYPTOR ACTIVE. PRESS ANY KEY TO COMPILE."
    ];
    this.sourceIndex = 0;
    this.autoTypeTimer = 0;
  }

  addChunk() {
    for (let i = 0; i < 2; i++) {
      this.lines.push(this.sourceCode[this.sourceIndex % this.sourceCode.length]);
      this.sourceIndex++;
    }
    if (this.lines.length > 36) {
      this.lines.splice(0, this.lines.length - 36);
    }
  }

  onInput(event) {
    this.addChunk();
  }

  render(ctx, engine, dt) {
    const width = engine.getLogicalWidth();
    const height = engine.getLogicalHeight();

    // Auto-typing when idle
    this.autoTypeTimer += dt;
    if (this.autoTypeTimer >= 0.35) {
      this.autoTypeTimer = 0;
      this.addChunk();
    }

    ctx.fillStyle = '#080c08';
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = '#00ff41';
    ctx.textAlign = 'left';

    const isMobile = width < 640;
    const fontSize = isMobile ? 10 : 14;
    const lineHeight = fontSize * 1.5;
    ctx.font = `${fontSize}px "Courier New", monospace`;

    let y = 30;
    for (const line of this.lines) {
      if (y > height - 30) break;
      ctx.fillText(line, 24, y);
      y += lineHeight;
    }

    // Blinking cursor
    const cursorVisible = Math.floor(engine.getElapsedTime() * 3) % 2 === 0;
    if (cursorVisible && y <= height - 30) {
      ctx.fillRect(24, y - fontSize + 3, fontSize * 0.6, fontSize);
    }
  }
}
