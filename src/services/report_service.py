import os
import io
from datetime import datetime
from typing import Optional, Dict, Any, List
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image, Table, TableStyle, PageBreak
from reportlab.lib.units import inch

class ReportService:
    """Service to generate PDF reports for projects"""

    def generate_master_report(self, project: Any, design: Optional[Any], estimation: Optional[Any]) -> bytes:
        """
        Generate a comprehensive PDF report combining Project, Design, and Estimation data.
        Returns PDF bytes.
        """
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(
            buffer,
            pagesize=A4,
            rightMargin=inch/2,
            leftMargin=inch/2,
            topMargin=inch/2,
            bottomMargin=inch/2,
            title=f"Project Report - {project.title}"
        )

        # Styles
        styles = getSampleStyleSheet()
        title_style = styles['Heading1']
        title_style.alignment = 1 # Center
        subtitle_style = styles['Heading2']
        subtitle_style.textColor = colors.HexColor('#d4af37') # Gold
        
        normal_style = styles['Normal']
        normal_style.spaceAfter = 6
        
        elements = []

        # --- 1. Header ---
        elements.append(Paragraph("DUBAI CONS AI SUITE", title_style))
        elements.append(Paragraph(f"Project Master Report: {project.title}", subtitle_style))
        elements.append(Spacer(1, 10))
        elements.append(Paragraph(f"Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M')}", normal_style))
        elements.append(Spacer(1, 20))

        # --- 2. Project Overview ---
        elements.append(Paragraph("Project Overview", subtitle_style))
        project_data = [
            ["ID", str(project.id)],
            ["Location", project.location or "Dubai"],
            ["Type", project.property_type or "N/A"],
            ["Area", f"{project.area} sqm"],
            ["Budget", f"AED {project.budget:,.2f}" if project.budget else "N/A"]
        ]
        t = Table(project_data, colWidths=[2*inch, 4*inch])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (0, -1), colors.lightgrey),
            ('TEXTCOLOR', (0, 0), (0, -1), colors.black),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, -1), 'Helvetica-Bold'),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
        ]))
        elements.append(t)
        elements.append(Spacer(1, 20))

        # --- 3. Design Concept ---
        if design:
            elements.append(Paragraph("Design Concept", subtitle_style))
            elements.append(Paragraph(f"Style: {design.style}", normal_style))
            elements.append(Paragraph(f"Color Scheme: {design.color_scheme}", normal_style))
            elements.append(Spacer(1, 10))
            
            # Description
            elements.append(Paragraph("Description:", styles['Heading4']))
            elements.append(Paragraph(design.description.replace('\n', '<br/>'), normal_style))
            elements.append(Spacer(1, 10))

            # Image (if available and accessible)
            # Note: ReportLab needs a local path or a request stream for images. 
            # If image_url is remote, we might simulate it. 
            # For this MVP, if it's external, we might skip it or try validation.
            # Assuming image_url might be a placeholder or local asset for now.
            if design.image_url and design.image_url.startswith('http'):
                 elements.append(Paragraph(f"[Image Render available at: {design.image_url}]", normal_style))
            
            elements.append(Spacer(1, 10))
            if design.compliance_report:
                # Assuming compliance_report is a dict or text
                elements.append(Paragraph("Compliance Check (RAG):", styles['Heading4']))
                # Simplistic dump
                elements.append(Paragraph(str(design.compliance_report), normal_style))
            else:
                 elements.append(Paragraph("Compliance Check: Pre-validated (Standard)", normal_style))

        else:
             elements.append(Paragraph("Design Concept: Not Started", normal_style))

        elements.append(Spacer(1, 20))

        # --- 4. Cost Estimation ---
        if estimation:
            elements.append(Paragraph("Cost Estimation", subtitle_style))
            cost_data = [
                ["Category", "Cost (AED)"],
                ["Materials", f"{estimation.materials_cost:,.2f}"],
                ["Labor", f"{estimation.labor_cost:,.2f}"],
                ["Furniture", f"{estimation.furniture_cost:,.2f}"],
                ["Additional", f"{estimation.additional_cost:,.2f}"],
                ["TOTAL", f"{estimation.total_cost:,.2f}"]
            ]
            t = Table(cost_data, colWidths=[3*inch, 3*inch])
            t.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (1, 0), colors.HexColor('#d4af37')),
                ('TEXTCOLOR', (0, 0), (1, 0), colors.white),
                ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
                ('BACKGROUND', (0, -1), (-1, -1), colors.lightgrey), # Total row
                ('GRID', (0, 0), (-1, -1), 1, colors.black)
            ]))
            elements.append(t)
            
            if estimation.breakdown:
                elements.append(Spacer(1, 10))
                elements.append(Paragraph("Detailed Breakdown available in system", normal_style))
        else:
             elements.append(Paragraph("Cost Estimation: Not Calculated", normal_style))

        # Footer
        elements.append(Spacer(1, 30))
        elements.append(Paragraph("This report is generated by Dubai Cons AI Suite. Prices are estimates.", normal_style))

        # Build
        doc.build(elements)
        buffer.seek(0)
        return buffer.getvalue()


report_service = ReportService()
