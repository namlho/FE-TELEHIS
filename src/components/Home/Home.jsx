import { Card, Row, Col, Statistic } from "antd"
import { ExperimentOutlined, RadarChartOutlined, HeartOutlined } from "@ant-design/icons"

function HomePage() {
  return (
    <div style={{ padding: "0" }}>
      {/* Hero Section */}
      <div style={{ textAlign: "center", marginBottom: "48px" }}>
        <h1
          style={{
            fontSize: "48px",
            fontWeight: "bold",
            background: "linear-gradient(135deg, #1890ff, #13c2c2)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: "16px",
          }}
        >
          TELEMEDICINE AGENT
        </h1>
        <p
          style={{
            fontSize: "20px",
            color: "#666",
            maxWidth: "800px",
            margin: "0 auto",
            lineHeight: "1.6",
          }}
        >
          Trợ lý y tế thông minh hỗ trợ tư vấn từ xa, chẩn đoán nhanh chóng và quản lý sức khỏe toàn diện với công nghệ
          AI tiên tiến.
        </p>
      </div>

      {/* Feature Cards */}
      <Row gutter={[24, 24]} style={{ marginBottom: "48px" }}>
        <Col xs={24} md={8}>
          <Card
            className="feature-card"
            style={{
              background: "linear-gradient(135deg, #e6f7ff, #f0fdfa)",
              border: "1px solid #b3e5fc",
              borderRadius: "12px",
              height: "200px",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  background: "linear-gradient(135deg, #1890ff, #13c2c2)",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                  fontSize: "24px",
                  color: "white",
                }}
              >
                <ExperimentOutlined />
              </div>
              <h3 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "8px" }}>Tư vấn từ xa 24/7</h3>
              <p style={{ color: "#666", fontSize: "14px" }}>
                Kết nối với bác sĩ chuyên khoa mọi lúc mọi nơi qua video call và chat
              </p>
            </div>
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card
            className="feature-card"
            style={{
              background: "linear-gradient(135deg, #f6ffed, #e6fffb)",
              border: "1px solid #b7eb8f",
              borderRadius: "12px",
              height: "200px",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  background: "linear-gradient(135deg, #52c41a, #13c2c2)",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                  fontSize: "24px",
                  color: "white",
                }}
              >
                <RadarChartOutlined />
              </div>
              <h3 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "8px" }}>AI Chẩn đoán thông minh</h3>
              <p style={{ color: "#666", fontSize: "14px" }}>
                Phân tích triệu chứng và đưa ra gợi ý chẩn đoán chính xác bằng AI
              </p>
            </div>
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card
            className="feature-card"
            style={{
              background: "linear-gradient(135deg, #f9f0ff, #fff2e8)",
              border: "1px solid #d3adf7",
              borderRadius: "12px",
              height: "200px",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  background: "linear-gradient(135deg, #722ed1, #fa8c16)",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                  fontSize: "24px",
                  color: "white",
                }}
              >
                <HeartOutlined />
              </div>
              <h3 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "8px" }}>Quản lý hồ sơ điện tử</h3>
              <p style={{ color: "#666", fontSize: "14px" }}>
                Lưu trữ và theo dõi lịch sử khám bệnh, đơn thuốc một cách an toàn
              </p>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Stats Section */}
      <Card
        style={{
          background: "linear-gradient(135deg, #1890ff, #13c2c2)",
          border: "none",
          borderRadius: "12px",
          color: "white",
        }}
      >
        <Row gutter={[24, 24]} style={{ textAlign: "center" }}>
          <Col xs={12} md={6}>
            <Statistic
              title={<span style={{ color: "rgba(255,255,255,0.8)" }}>Bệnh nhân đã khám</span>}
              value="N/A"
              valueStyle={{ color: "white", fontSize: "32px", fontWeight: "bold" }}
            />
          </Col>
          <Col xs={12} md={6}>
            <Statistic
              title={<span style={{ color: "rgba(255,255,255,0.8)" }}>Độ chính xác chẩn đoán</span>}
              value="N/A"
              valueStyle={{ color: "white", fontSize: "32px", fontWeight: "bold" }}
            />
          </Col>
          <Col xs={12} md={6}>
            <Statistic
              title={<span style={{ color: "rgba(255,255,255,0.8)" }}>Hỗ trợ liên tục</span>}
              value="24/7"
              valueStyle={{ color: "white", fontSize: "32px", fontWeight: "bold" }}
            />
          </Col>
          <Col xs={12} md={6}>
            <Statistic
              title={<span style={{ color: "rgba(255,255,255,0.8)" }}>Bác sĩ chuyên khoa</span>}
              value="N/A"
              valueStyle={{ color: "white", fontSize: "32px", fontWeight: "bold" }}
            />
          </Col>
        </Row>
      </Card>

      {/* Contact Information Section */}
      <div style={{ marginTop: "48px" }}>
        <Row gutter={[32, 32]}>
          <Col xs={24} lg={12}>
            <Card
              style={{
                background: "linear-gradient(135deg, #f8fafc, #f1f5f9)",
                border: "1px solid #e2e8f0",
                borderRadius: "16px",
                height: "100%",
              }}
            >
              <div style={{ padding: "8px" }}>
                <h3
                  style={{
                    fontSize: "24px",
                    fontWeight: "700",
                    marginBottom: "24px",
                    color: "#1e40af",
                    textAlign: "center",
                  }}
                >
                  Thông tin liên hệ
                </h3>

                <div style={{ space: "16px" }}>
                  <div style={{ display: "flex", alignItems: "center", marginBottom: "16px" }}>
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
                        borderRadius: "10px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: "16px",
                        fontSize: "16px",
                        color: "white",
                      }}
                    >
                      🏢
                    </div>
                    <div>
                      <div style={{ fontWeight: "600", color: "#374151" }}>Địa chỉ</div>
                      <div style={{ color: "#6b7280", fontSize: "14px" }}>Tầng 3, 607 Xô Viết Nghệ Tĩnh, Phường Bình Thạnh, Thành phố Hồ Chí Minh </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", marginBottom: "16px" }}>
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        background: "linear-gradient(135deg, #10b981, #059669)",
                        borderRadius: "10px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: "16px",
                        fontSize: "16px",
                        color: "white",
                      }}
                    >
                      📞
                    </div>
                    <div>
                      <div style={{ fontWeight: "600", color: "#374151" }}>SĐT</div>
                      <div style={{ color: "#6b7280", fontSize: "14px" }}>028 3785 3388</div>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", marginBottom: "16px" }}>
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        background: "linear-gradient(135deg, #f59e0b, #d97706)",
                        borderRadius: "10px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: "16px",
                        fontSize: "16px",
                        color: "white",
                      }}
                    >
                      ✉️
                    </div>
                    <div>
                      <div style={{ fontWeight: "600", color: "#374151" }}>Email</div>
                      <div style={{ color: "#6b7280", fontSize: "14px" }}>hoangthuong.vu@hoangphucthanh.vn</div>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", marginBottom: "16px" }}>
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        background: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
                        borderRadius: "10px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: "16px",
                        fontSize: "16px",
                        color: "white",
                      }}
                    >
                      🌐
                    </div>
                    <div>
                      <div style={{ fontWeight: "600", color: "#374151" }}>Website</div>
                      <div style={{ color: "#6b7280", fontSize: "14px" }}>www.hoangphucthanh.vn</div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card
              style={{
                background: "linear-gradient(135deg, #f0f9ff, #e0f2fe)",
                border: "1px solid #0ea5e9",
                borderRadius: "16px",
                height: "100%",
              }}
            >
              <div style={{ padding: "8px", textAlign: "center" }}>
                <h2
                  style={{
                    fontSize: "28px",
                    fontWeight: "800",
                    marginBottom: "8px",
                    color: "#374151",
                  }}
                >
                  CÔNG TY <span style={{ color: "#0ea5e9" }}>HOÀNG PHÚC THÀNH</span>
                </h2>

                <p
                  style={{
                    fontSize: "16px",
                    color: "#0ea5e9",
                    fontWeight: "600",
                    marginBottom: "20px",
                  }}
                >
                  Thương hiệu thiết bị y tế Chất lượng - Uy tín - Chuyên nghiệp.
                </p>

                <p
                  style={{
                    fontSize: "14px",
                    color: "#6b7280",
                    lineHeight: "1.6",
                    marginBottom: "24px",
                    textAlign: "justify",
                  }}
                >
                  Hoàng Phúc Thành là nhà phân phối chính thức thiết bị nội soi Karl Storz, thiết bị y tế từ xa
                  GlobalMed cùng nhiều hãng thiết bị y tế uy tín khác tại Việt Nam. Chúng tôi không ngừng cải tiến và mở
                  rộng dịch vụ bán hàng, dịch vụ sửa chữa thiết bị nhằm mang lại lợi ích tốt nhất cho khách hàng.
                </p>

                <Row gutter={[16, 16]}>
                  <Col xs={24} md={8}>
                    <div style={{ textAlign: "center" }}>
                      <div
                        style={{
                          width: "60px",
                          height: "60px",
                          background: "linear-gradient(135deg, #0ea5e9, #0284c7)",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          margin: "0 auto 12px",
                          fontSize: "24px",
                          color: "white",
                        }}
                      >
                        🛡️
                      </div>
                      <h4 style={{ fontSize: "16px", fontWeight: "700", color: "#374151", marginBottom: "4px" }}>
                        CHẤT LƯỢNG
                      </h4>
                    </div>
                  </Col>

                  <Col xs={24} md={8}>
                    <div style={{ textAlign: "center" }}>
                      <div
                        style={{
                          width: "60px",
                          height: "60px",
                          background: "linear-gradient(135deg, #0ea5e9, #0284c7)",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          margin: "0 auto 12px",
                          fontSize: "24px",
                          color: "white",
                        }}
                      >
                        👁️
                      </div>
                      <h4 style={{ fontSize: "16px", fontWeight: "700", color: "#374151", marginBottom: "4px" }}>
                        UY TÍN
                      </h4>
                    </div>
                  </Col>

                  <Col xs={24} md={8}>
                    <div style={{ textAlign: "center" }}>
                      <div
                        style={{
                          width: "60px",
                          height: "60px",
                          background: "linear-gradient(135deg, #0ea5e9, #0284c7)",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          margin: "0 auto 12px",
                          fontSize: "24px",
                          color: "white",
                        }}
                      >
                        ⭐
                      </div>
                      <h4 style={{ fontSize: "16px", fontWeight: "700", color: "#374151", marginBottom: "4px" }}>
                        CHUYÊN NGHIỆP
                      </h4>
                    </div>
                  </Col>
                </Row>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default HomePage
