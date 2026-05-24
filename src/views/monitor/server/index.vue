<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24" class="card-box">
        <Analysis></Analysis>
      </el-col>
      <el-col :span="24" class="card-box">
        <Stream></Stream>
      </el-col>
      <el-col :span="24" class="card-box">
        <Sysconfig></Sysconfig>
      </el-col>
      <el-col :span="12" class="card-box">
        <el-card>
          <div slot="header">
            <span><i class="el-icon-cpu"></i> CPU</span>
          </div>
          <div class="el-table el-table--enable-row-hover el-table--medium">
            <table cellspacing="0" style="width: 100%">
              <thead>
                <tr>
                  <th class="el-table__cell is-leaf">
                    <div class="cell">{{ $t("server.property") }}</div>
                  </th>
                  <th class="el-table__cell is-leaf">
                    <div class="cell">{{ $t("server.value") }}</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="el-table__cell is-leaf">
                    <div class="cell">{{ $t("server.cores") }}</div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell" v-if="server.cpu">
                      {{ server.cpu.cpuNum }}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="el-table__cell is-leaf">
                    <div class="cell">
                      {{ $t("server.userUtilizationRate") }}
                    </div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell" v-if="server.cpu">
                      {{ server.cpu.used }}%
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="el-table__cell is-leaf">
                    <div class="cell">{{ $t("server.systemUsage") }}</div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell" v-if="server.cpu">
                      {{ server.cpu.sys }}%
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="el-table__cell is-leaf">
                    <div class="cell">{{ $t("server.currentIdleRate") }}</div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell" v-if="server.cpu">
                      {{ server.cpu.free }}%
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </el-card>
      </el-col>

      <el-col :span="12" class="card-box">
        <el-card>
          <div slot="header">
            <span
              ><i class="el-icon-tickets"></i> {{ $t("server.memory") }}</span
            >
          </div>
          <div class="el-table el-table--enable-row-hover el-table--medium">
            <table cellspacing="0" style="width: 100%">
              <thead>
                <tr>
                  <th class="el-table__cell is-leaf">
                    <div class="cell">{{ $t("server.property") }}</div>
                  </th>
                  <th class="el-table__cell is-leaf">
                    <div class="cell">{{ $t("server.memory") }}</div>
                  </th>
                  <th class="el-table__cell is-leaf">
                    <div class="cell">JVM</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="el-table__cell is-leaf">
                    <div class="cell">{{ $t("server.totalMemory") }}</div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell" v-if="server.mem">
                      {{ server.mem.total }}G
                    </div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell" v-if="server.jvm">
                      {{ server.jvm.total }}M
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="el-table__cell is-leaf">
                    <div class="cell">{{ $t("server.usedMemory") }}</div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell" v-if="server.mem">
                      {{ server.mem.used }}G
                    </div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell" v-if="server.jvm">
                      {{ server.jvm.used }}M
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="el-table__cell is-leaf">
                    <div class="cell">{{ $t("server.remainingMemory") }}</div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell" v-if="server.mem">
                      {{ server.mem.free }}G
                    </div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell" v-if="server.jvm">
                      {{ server.jvm.free }}M
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="el-table__cell is-leaf">
                    <div class="cell">{{ $t("server.utilizationRate") }}</div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div
                      class="cell"
                      v-if="server.mem"
                      :class="{ 'text-danger': server.mem.usage > 80 }"
                    >
                      {{ server.mem.usage }}%
                    </div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div
                      class="cell"
                      v-if="server.jvm"
                      :class="{ 'text-danger': server.jvm.usage > 80 }"
                    >
                      {{ server.jvm.usage }}%
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </el-card>
      </el-col>

      <el-col :span="24" class="card-box">
        <el-card>
          <div slot="header">
            <span
              ><i class="el-icon-monitor"></i>
              {{ $t("server.serverInformation") }}</span
            >
          </div>
          <div class="el-table el-table--enable-row-hover el-table--medium">
            <table cellspacing="0" style="width: 100%">
              <tbody>
                <tr>
                  <td class="el-table__cell is-leaf">
                    <div class="cell">{{ $t("server.serverName") }}</div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell" v-if="server.sys">
                      {{ server.sys.computerName }}
                    </div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell">{{ $t("server.os") }}</div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell" v-if="server.sys">
                      {{ server.sys.osName }}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="el-table__cell is-leaf">
                    <div class="cell">{{ $t("server.serverIP") }}</div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell" v-if="server.sys">
                      {{ server.sys.computerIp }}
                    </div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell">
                      {{ $t("server.systemArchitecture") }}
                    </div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell" v-if="server.sys">
                      {{ server.sys.osArch }}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </el-card>
      </el-col>

      <el-col :span="24" class="card-box">
        <el-card>
          <div slot="header">
            <span
              ><i class="el-icon-coffee-cup"></i>
              {{ $t("server.JavaVirtualMachineInformation") }}</span
            >
          </div>
          <div class="el-table el-table--enable-row-hover el-table--medium">
            <table cellspacing="0" style="width: 100%; table-layout: fixed">
              <tbody>
                <tr>
                  <td class="el-table__cell is-leaf">
                    <div class="cell">{{ $t("server.javaName") }}</div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell" v-if="server.jvm">
                      {{ server.jvm.name }}
                    </div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell">{{ $t("server.javaVersion") }}</div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell" v-if="server.jvm">
                      {{ server.jvm.version }}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="el-table__cell is-leaf">
                    <div class="cell">{{ $t("server.startupTime") }}</div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell" v-if="server.jvm">
                      {{ server.jvm.startTime }}
                    </div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell">{{ $t("server.runningTime") }}</div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell" v-if="server.jvm">
                      {{ server.jvm.runTime }}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td colspan="1" class="el-table__cell is-leaf">
                    <div class="cell">{{ $t("server.installationPath") }}</div>
                  </td>
                  <td colspan="3" class="el-table__cell is-leaf">
                    <div class="cell" v-if="server.jvm">
                      {{ server.jvm.home }}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td colspan="1" class="el-table__cell is-leaf">
                    <div class="cell">{{ $t("server.projectPath") }}</div>
                  </td>
                  <td colspan="3" class="el-table__cell is-leaf">
                    <div class="cell" v-if="server.sys">
                      {{ server.sys.userDir }}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td colspan="1" class="el-table__cell is-leaf">
                    <div class="cell">{{ $t("server.runningParameter") }}</div>
                  </td>
                  <td colspan="3" class="el-table__cell is-leaf">
                    <div class="cell" v-if="server.jvm">
                      {{ server.jvm.inputArgs }}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </el-card>
      </el-col>

      <el-col :span="24" class="card-box">
        <el-card>
          <div slot="header">
            <span
              ><i class="el-icon-receiving"></i>
              {{ $t("server.diskStatus") }}</span
            >
          </div>
          <div class="el-table el-table--enable-row-hover el-table--medium">
            <table cellspacing="0" style="width: 100%">
              <thead>
                <tr>
                  <th class="el-table__cell el-table__cell is-leaf">
                    <div class="cell">{{ $t("server.drivePath") }}</div>
                  </th>
                  <th class="el-table__cell is-leaf">
                    <div class="cell">{{ $t("server.fileSystem") }}</div>
                  </th>
                  <th class="el-table__cell is-leaf">
                    <div class="cell">{{ $t("server.driveType") }}</div>
                  </th>
                  <th class="el-table__cell is-leaf">
                    <div class="cell">{{ $t("server.totalSize") }}</div>
                  </th>
                  <th class="el-table__cell is-leaf">
                    <div class="cell">{{ $t("server.availableSize") }}</div>
                  </th>
                  <th class="el-table__cell is-leaf">
                    <div class="cell">{{ $t("server.usedSize") }}</div>
                  </th>
                  <th class="el-table__cell is-leaf">
                    <div class="cell">{{ $t("server.percentageUsed") }}</div>
                  </th>
                </tr>
              </thead>
              <tbody v-if="server.sysFiles">
                <tr v-for="(sysFile, index) in server.sysFiles" :key="index">
                  <td class="el-table__cell is-leaf">
                    <div class="cell">{{ sysFile.dirName }}</div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell">{{ sysFile.sysTypeName }}</div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell">{{ sysFile.typeName }}</div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell">{{ sysFile.total }}</div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell">{{ sysFile.free }}</div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell">{{ sysFile.used }}</div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div
                      class="cell"
                      :class="{ 'text-danger': sysFile.usage > 80 }"
                    >
                      {{ sysFile.usage }}%
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getServer } from "@/api/monitor/server";
import Analysis from "./components/analysis.vue";
import Stream from "./components/stream.vue";
import Sysconfig from "./components/sysconfig.vue";
export default {
  name: "Server",
  data() {
    return {
      // Server information
      server: [],
    };
  },
  components: {
    Analysis,
    Stream,
    Sysconfig,
  },
  created() {
    this.getList();
    this.openLoading();
  },
  methods: {
    /** Query server info */
    getList() {
      getServer().then((response) => {
        this.server = response.data;
        this.$modal.closeLoading();
      });
    },
    // Open loading layer
    openLoading() {
      this.$modal.loading(this.$t("commonTips.serverLoading"));
    },
  },
};
</script>
